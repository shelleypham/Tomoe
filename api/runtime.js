const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
const session = require('express-session');
const methodOverride = require('method-override');
const http = require('http');
const path = require('path');
const app = express();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const request = require('request');
const dotenv = require('dotenv');
const Database = require('arangojs').Database;


class Hackathon{
  constructor(name, capacity){
    try {

      this.name = name;
      this.capacity = capacity;

    } catch(e) {
      new Error("");
    }
  }
}

function setUpDatabases(){
  const db = new Database(process.env.DB_URI);
        db.useDatabase('tomoe');

  let d = {
          Attendees: db.collection('attendees'),
          Hackathons: db.collection('hackathons'),
          Companies: db.collection('companies'),
          CompanyUsers: db.collection('company_users'),
        }

  const hackathon_key = 0; // always the first document

  collection.lookupByKeys(hackathon_key)
    .then((data) => {
      d.Hackathon = data[0];
      return d;
    });
}

module.exports = function(status){

  // load environmental vars
  dotenv.load();

  // set up new db
  db = setUpDatabases();

  // set base directory as one above
  __dirname = __dirname + "/..";

  // set app

  app.set('port', process.env.PORT);
  app.set('views', path.join( __dirname , 'views'));
  app.use(logger('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({ secret: process.env.SESSIONSECRET, resave:false, saveUninitialized:false}));
  app.use(methodOverride());

  // warning
  if(status === "development"){
    console.log(
      `\n******************************************************************
       \n***YOU ARE CURRENTLY RUNNING A DEVELOPMENT VERSION OF THIS APP**
       \n******************************************************************
       \nPlease make sure you are developing right now, and not using this
       \nfor production.
       \n
       \nTo set up server for production, please use node production.js.
       \n******************************************************************
       \n`
    );
    }

  // routes to pages
  require('./routes/pages.js')(app);


  app.use(express.static(path.join(__dirname, 'public')));

  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
};
