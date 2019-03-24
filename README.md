# cube-racer
ajax version of rubicks-racer

This is a web app that will let authenticated users chat and race each other solving rubicks cubes in real time,  in 'race rooms'.  It will
also record this data to their profile and include basic statistics.  



To install:

`$ npm install`

For right it's necessary to create and setup the database:

` mysql> create table users (id varchar(128), firstname varchar(25), lastname varchar(25), email varchar(50), bmonth varchar(20), bday int(31), byear int(11), handle varchar(20));` 
