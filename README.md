# cube-racer
ajax version of rubicks-racer

W i P

<h3>This is a web app that serves three primary functions:</h3>

1) Allow users to do timed rubicks cubes solves and record their data in a user profile which provides basic analytics and that others can see.  There are two modes: practice mode and official[sic] mode.  Practice mode doesn't record the times, while official does.

2) Allow users to follow each other, so that on their home page they'll see their friends' most recent times and best times, et c.

3) Allow users to join 'race rooms' which are chat rooms that will have a shared timer device on them, so that users can race each other or just hang out and solve together.  Room admin will be able to set the rules, i.e. inspection time, type of cube.  


<h3>To install:</h3>

`$ npm install`

Check server.js for where you'll have to provide your own credentials:
- SSL certs / key
- database credentials
- just look around arright?


For right now it's necessary to create and setup the MYSQL database:

`mysql> create table users (id varchar(128), firstname varchar(25), lastname varchar(25), email varchar(50), bmonth varchar(20), bday int(31), byear int(11), handle varchar(20));` 
