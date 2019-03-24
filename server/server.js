//npm modules
const express = require('express');
const app = express();
const fs = require('fs');
const SSLoptions = {
    key: fs.readFileSync('ssl/localhost.key', 'utf8'),
    cert: fs.readFileSync('ssl/localhost.crt','utf8'),
};
const https = require('https').Server(SSLoptions, app);
const uuid = require('uuid/v4')
const session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');




////////////////////////////
//  S E T U P  A N D  I N I T
////////////////////////////


//  Config options for MySQLStore
var options = {
    host: 'localhost',
    port: 3306,
    user: 'cuber',
    password: 'gperm',
    database: 'cuberacer'
};


//  Just pass this in later
var sessionStore = new MySQLStore(options);


//  function for opening a mysql connection
function connectToDatabase(){
	connection = mysql.createConnection({
		host : 'localhost',
		port: 3306,					
		user : 'cuber',          
		password : 'gperm',  
		database : 'cuberacer'     
	});
	connection.connect(function(err){
		if (err) {
			console.log('error connecting: ' + err.stack);
			return;
		}
		console.log('New MYSQL connection: ' + connection.threadId);
	});
	return connection;
}


//  function for closing mysql connection
function closeConnectToDatabase(connection){
	connection.end(function(err){
		if (err) {console.log(err);}
	});
}


// config passport Local strategy
passport.use(new LocalStrategy(
	{usernameField: 'email',
	 passwordField: 'password',
	 passReqToCallback: true},
	(req, email, password, done) => {
		var connection = connectToDatabase();
		connection.query('SELECT * FROM users WHERE email = ?', [email], 
						function(error, results){
			var userData = results[0];
			if (error) {return done(error);}
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
	var connection = connectToDatabase();
	connection.query("select * from users where id = ?", [id], function(error, results){
		if (error){console.log(error);}
		else {done(error, results[0]);}
	});
});


// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
  store: sessionStore,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());


////////////////////////////////////////////
//  here, have some E X P R E S S  R O U T E S
////////////////////////////////////////////

//  Root directory to serve content from
const rootDir = {root: '/mnt/c/xampp/htdocs/projects/cube-racer'};

//  Serve static content (css, images)
app.use(express.static('/mnt/c/xampp/htdocs/projects/cube-racer/public'));

//  serve javascript.  should this be under public...?  still accessible. 
app.get('/js/index.js', (req, res) => {
	res.sendFile('/js/index.js', rootDir);
});

app.get('/js/land-page.js', (req, res) =>{
	res.sendFile('/js/land-page.js', rootDir);
});

//  Serve player profile 'template'
//app.get('/:username', function(req, res){
//	res.sendFile('profile.html', dirRoot);
//});

// create the homepage route at '/'
app.get('/', (req, res) => {
  res.sendFile('/index.html', rootDir)
})

//  Create the signup route
app.get('/signup', (req, res) => {
	res.sendFile(__dirname + '/signup.html');
});

//  Signup POST route
app.post('/signup', (req, res, next) => {
	var body = req.body;
	//  Plug signup data into the database
	var connection = connectToDatabase();
	connection.query('SELECT * FROM users WHERE email = ?', [body.email], 
					  function(error, results, fields){
		if (error){console.log(error)}
		else {
			console.log(results);
			if (results[0]){res.send('email already in use')}
			else {
				connection.query('INSERT INTO users (id, email, password, firstname, lastname, bmonth, bday, byear, handle) values (?,?,?,?,?,?,?,?,?)',
								[req.sessionID, body.email, body.password, body.firstname, body.lastname, body.bmonth, body.bday, body.byear, body.handle], 
								function(error, fields, results){
					if (error){console.log(error)}
					else {
						res.send('account created!');
					}

				});
			}
		}
	});
});

//  login GET route
app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/login.html');
})

//  login POST route
app.post('/login', (req, res, next) => {
  passport.authenticate('local', {failureFlash: true}, (err, user, info) => {
	  if(info) {return res.send(info.message)}
	  if (err) {return next(err);}
	  if (!user){return res.redirect('/login');}
	  req.login(user, (err) => {
		  if (err){return next(err)};
		  return res.sendFile('/land-page.html', rootDir);
	  })
  })(req, res, next);
})


//  Open them ears up
https.listen(1337, () => {
  console.log('Listening on localhost:1337')
})





