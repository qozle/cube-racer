const express = require('express');
const app = express();
const fs = require('fs');
const SSLoptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/01014.org-0001/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/01014.org-0001/cert.pem','utf8'),
    ca : fs.readFileSync('/etc/letsencrypt/live/01014.org-0001/fullchain.pem', 'utf8')
};
const https = require('https').Server(SSLoptions, app);
const uuid = require('uuid/v4')
const session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const io = require('socket.io')(https);




////////////////////////////
//  S E T U P  A N D  I N I T
////////////////////////////

//  mysql connect info
var connect_info = {
    host: 'localhost',
    port: 3306,
    user: 'cuber',
    password: 'gperm',
    database: 'cuberacer'
};

//  Just pass this in later
var sessionStore = new MySQLStore(connect_info);
//  mysql pool
var pool  = mysql.createPool(connect_info);


// config passport Local strategy
passport.use(new LocalStrategy(
	{usernameField: 'email',
	 passwordField: 'password',
	 passReqToCallback: true},
	(req, email, password, done) => {
		pool.query('SELECT * FROM users WHERE email = ?', [email], 
						function(error, results){
			var userData = results[0];
			if (error) throw error;
			if (!userData){
				return done(null, false, {message: 'no user found with that email'});
			}
			if (userData.password != password){
				return done(null, false, {message: 'incorrect password'});
			}
			if (userData.email == email && userData.password == password){
				return done(null, userData);
			}
		});
	}
));


//  How passport will serialize the user data
passport.serializeUser((user, done) => {
	done(null, user.id);
});

//  How passport will deserialize the user data
passport.deserializeUser(function(id, done) {
	pool.query("select * from users where id = ?", [id], function(error, results){
		if (error){console.log(error);}
		else {done(error, results[0]);}
	});
});


// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//  Serve static content (css, images)
app.use(express.static('/var/www/html/cube-racer.com/public_html/public/'));
app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
  store: sessionStore,
  secret: 'keyboard cat',  //  replace w/ rndm key generated by env variables
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());




//////////////////////
//  here, have some 
/////////////////////////////////
//  E X P R E S S  R O U T E S 
/////////////////////////////////


//  Root directory to serve content from
const rootDir = {root: '/var/www/html/cube-racer.com/public_html/'};

app.get('/favicon.ico', (req, res) => {
	res.sendFile('/public/assets/imgs/favicon.ico', rootDir);
});

//  Serve player profile 'template'
app.get('/getProfile', function(req, res){
	res.sendFile('/views/profile.html', rootDir);
});

//  Serve profile information
app.post('/profileData', (req, res) => {
	
	var body = req.body;
	var respData = [];
	
//	  Get the player's basic profile info
	pool.query('SELECT * FROM users WHERE handle = ?', [body.profile.replace('/users/','')], function(error, results){
		if (error)throw error;
		if (!results[0]){
			res.send("There's no user handle for " + body.profile)
		} else if (results[0]){
			respData.push(results[0]);
			pool.query(`SELECT * FROM ${body.profile.replace('/users/','')};`, 
			function(error, results){
				if (error){console.log(error)}
				respData.push(results);
				res.send(respData);
			});
		}
		
	});
	
});


// create the homepage route at '/'
app.get('/', (req, res) => {
	if (req.isAuthenticated()){
		var html = fs.readFileSync('../views/head-template.html', 'utf8');
		html += fs.readFileSync('../views/home-page.html','utf8');
		res.send(html)
	} else {
		var html = fs.readFileSync('../views/head-template.html', 'utf8');
		html += fs.readFileSync('../views/index.html','utf8');
		res.send(html)
	}
});

//app.get('/homePage', (req, res) =>{
//	if (req.isAuthenticated()){
//		res.sendFile('/views/home-page.html', rootDir);
//	} else {
//		res.redirect('/');
//	}
//});

app.get('/timer', (req, res)=>{
	res.sendFile('/views/timer.html', rootDir);
});

app.get('/race', (req, res)=>{
	if (req.isAuthenticated()){
		res.sendFile('/views/race.html', rootDir);
	}
});

//  Signup POST route
app.post('/signup', (req, res, next) => {
	var body = req.body;
	//  Plug signup data into the database
	
	pool.query('SELECT * FROM users WHERE email = ?', [body.email], 
					  function(error, results, fields){
		if (error){console.log(error)}
		else {
			if (results[0]){res.send('email already in use')}
			else {
				//  Insert user info into database
				pool.query('INSERT INTO users (id, email, password, firstname, lastname, bmonth, bday, byear, handle) values (?,?,?,?,?,?,?,?,?)',
								[req.sessionID, body.email, body.password, body.firstname, body.lastname, body.bmonth, body.bday, body.byear, body.handle], 
								function(error, fields, results){
					if (error){console.log(error)}
				});
				
				//  create a new table for the users scores
				pool.query(`CREATE TABLE ${body.handle} (cube varchar(25), min int(3), sec int(3), ms int(4), date DATETIME);`, 
								function(error, results){
					if (error) {console.log(error)}
					else {
						res.send('account created!');
					}
				}); 
			}
		}
	});
	
});

//  login GET route
app.get('/login-signup', (req, res) => {
	res.sendFile('/views/login_signup.html', rootDir);
})

//  login POST route
app.post('/login', (req, res, next) => {
  passport.authenticate('local', {failureFlash: true}, (err, user, info) => {
	  if(info) {return res.send(info.message)}
	  if (err) {return next(err);}
	  if (!user){return res.redirect('/login');}
	  req.login(user, (err) => {
		  if (err){return next(err)};
		  var respData = {
			  html: fs.readFileSync('../views/home-page.html', 'utf8'),
			  user: req.user.handle
		  }
		  return res.send(respData);
	  })
  })(req, res, next);
});

//  logout route
app.get('/logout', (req, res) => {
	
	req.session.destroy(function(){
		res.sendFile('/views/index.html', rootDir)
	});
});

//  serve a list of all user names
app.get('/getUserList', (req, res)=>{
	pool.query('SELECT handle FROM users;', (index, results)=> {
		res.send(results);
	});
});

//  new time data to be inserted into the user's table
app.post('/newTime', (req, res) => {
	if(req.isAuthenticated()){
		console.log("ok you're authenticated");
		var user = req.user;
		console.log('inside /newtime')
		
		pool.query(`INSERT INTO ${user.handle} (cube, min, sec, ms, date) VALUES ('3x3', '${req.body.mins}', '${req.body.secs}', '${req.body.ms}', NOW())`), function(error, results){
			if (error) {console.log(error)}
		}
		res.send('data inserted!');
	} else {
		console.log("looks like no auth buddy");
	}
});


//  Open them ears up
https.listen(1337, () => {
  console.log('Listening on localhost:1337')
})


//  S O C K E T . I O  S T U F F 
io.on('connection', (socket) =>{
	console.log('someone just signed in yao, at ' + new Date());
	socket.join('general');
	
	
	
	//  Disconnect
	socket.on('disconnect', (socket)=>{
		console.log('someone just left yao, at ' +  new Date())
	});
	
	
	
	//  Send the current rooms
	socket.on('update rooms', ()=>{
		var allSockets = [];
		var allRooms = [];
		for (room in io.sockets.adapter.rooms){
			allRooms.push(room);
		};
		for (sckConn in io.sockets.sockets){
			allSockets.push(sckConn);
		}
		console.log(allSockets);
		console.log(allRooms);
		allSockets.forEach((aSocket, index)=>{
			allRooms.forEach((aRoom, iindex)=>{
				if (aSocket == aRoom){
					allRooms.splice(iindex, 1);
				}
			});
		});
		io.emit('update rooms', {rooms: allRooms});
	});
	
	//  New Message
	socket.on('newMessage', (msgData)=>{
		io.to(msgData.room).emit('newMessage', msgData);
	});
	
	//  Make new room
	socket.on('make new room', (data)=>{
		socket.join(data.roomName);
		io.to(data.roomName).emit('newMessage', {handle: 'server', msg: "Welcome to " + data.roomName, room: data.roomName});
		
	});
	
	//  Leave room
	socket.on('leave room', (data)=>{
		socket.leave(data.room);
	});
	
	//  Join new room
	socket.on('join new room', (data)=>{
		socket.join(data.roomName);
		io.to(data.roomName).emit('newMessage', {handle: 'server', msg: data.handle + " just joined the room", room: data.roomName});
	});
	
});









//  Gracefully shut down server- what a concept!
//  This allows me use one connection / pool for 
//  mysql
process.on( 'SIGINT', function() {
  	console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
	
	pool.end();
	
  	process.exit();
})




