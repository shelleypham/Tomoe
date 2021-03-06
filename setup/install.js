const readlineSync = require('readline-sync');
const utilities = require('../api/tools/util.js');
const async = require('async');
const default_db_uri = "http://root:@127.0.0.1:8000";
const Database = require('arangojs').Database;
const admin = require('../api/tools/users.js').admin;
const pack = require('../package.json');
let mode = "dev"; // defaults to dev enironment
let db; // database as a clobal variable
// list the names of databases
const Database_Names_List = {
  dev:{
    admin:"dev_tomoe_admin",
    hackathon:"dev_tomoe_hacks"
  },
  live:{
    admin:"tomoe_admin",
    hackathon:"tomoe_hacks"
  },
}

let Database_Names = Database_Names_List[mode]; // default



// class defined
class installerPackage extends admin{
  constructor(email){
    super({email:email, rank:"all"});

    this.hackathon_name = null;
  }


  // so we can set up the hackathon in the meta-db so we can refer to it later
  addHackathon(hackathon_name){
    this.hackathon_name = hackathon_name;
  }

  returnInstaller(){
    return {
      email:this.email,
      password:this.password,
      hackathon_name:this.hackathon_name,
      temp_password:this.temp_password,
    }
  }
}



// welcome
function startInstall(mode_insert){
  mode = mode_insert;

  const introText = `Hello there! Welcome to Tomoe, a universal api-server for user management at Hackathons!\n\nThis is a little inbuilt installer that will help you set up your own Tomoe server!\n\n`

  console.log(introText);


  console.log("I will ask you a few questions so we can get you setup.");

  setMode();

}


// functions
function setMode(modeOverride){
  Database_Names = Database_Names_List[mode]; // update database names
  setDBURI();
}

function setDBURI(){
  let db_uri_input = readlineSync.question(`What is the URI to your arangodb instance, leave blank if it is default to: (${default_db_uri}):\n`);
      db_uri = db_uri_input || default_db_uri;

  // setup DB data
  db = new Database(db_uri);

  checkIfTomoeInstanceInstalled();
}


// Functions
function checkIfTomoeInstanceInstalled(){
  db.listDatabases().then(names => {
      if(names.indexOf("tomoe_admin") !== -1 || names.indexOf("tomoe_hacks") !== -1 || names.indexOf("dev_tomoe_hacks") !== -1 || names.indexOf("dev_tomoe_admin") !== -1 ){
        let ans = readlineSync.question(`There already seems to be an instance of Tomoe installed - do you want to drop your databases and start a new server?\n (y/n):`);
        if(ans === "y"){
          clearDB(() => {
            askUserForEmail();
          });
        } else {
          console.log("Ended installer file");
        }
      } else {
        askUserForEmail(); // create user then actually create database
      }
  },
  err => {
    console.error(`Failed to lookup databasees:${err}\n Ending Install`);
  });
}


function askUserForEmail(){
  let email = readlineSync.question(`We will now create an account for the admin panel, please enter your email address.\n`);
  let valid_email = utilities.validate.email(email);


  if(valid_email){
    let pack = new installerPackage(email);
    askUserForPassword(pack);
  } else {
    console.log(`\nPlease enter a valid email!`);
    askUserForEmail();
  }
}

function askUserForPassword(pack){
  let password = readlineSync.questionNewPassword(`Please enter a password for the account: ${pack.email}.\n`, {min:6, max:25});

  if(password){
    pack.setPassword(password);

    askHackathonName(pack);
  } else {
    console.log(`\nPlease enter a valid password!`);
    askUserForPassword(pack);
  }
}



function askHackathonName(pack){
  let hackathon = readlineSync.question(`Last question, what's your Hackathon's name?\n`);

  if(hackathon){
    pack.addHackathon(hackathon);
    installServerSoftware(pack);
  } else {
    console.log(`Please enter a valid name for a Hackathon!\n`);
    askHackathonName(pack);
  }
}


function installServerSoftware(pack){
  // create databases
  // Admin DB = admin accounts for tomoe server
  // Hacks DB = everything else

  db.createDatabase(Database_Names.admin).then(() => {
    db.createDatabase(Database_Names.hackathon).then(() => {
      db.useDatabase(Database_Names.admin);
      // create admin accounts
      pack.returnInstaller();

      const users = db.collection('users');


      users.create().then(
        () => {
          // create admin files

          pack.save(db, users, pack, function(){

            hackathonInstaller(pack);
          }, function(err){
            console.error('Failed to save document:', err)
            installFailed();
          });


        },
        err =>  {
          console.error(`Failed to create user collection:${err}\n Ending Install`);
          installFailed();
      });
    },
    err => {
      console.error(`Failed to create hackathon database:${err}\n Ending Install`);

      installFailed();
    });
  },
  err => {
    console.error(`Failed to create admin database:${err}\n Ending Install`);

    installFailed();
  });

}

const CollectionNames = ["attendees", "hackathons", "admin", "hackathons", "companies"];
function hackathonInstaller(pack){
  // do stuff with hacks
  db.useDatabase(Database_Names.hackathon);
  async.each(CollectionNames, function(collection, callback) {
    let current_collection = db.collection(collection);
    current_collection.create().then(
      () => {
        callback();
      },
      err =>  {
        callback(err);
    });

  }, function(err) {
    if(err){
      console.error(`Failed to create collection:${err}\n Ending Install`);
      installFailed();
    } else {
      doneInstall();
    }

  });
}

function clearDB(cb){
  db.dropDatabase(Database_Names.admin)
    .then(() => {
      db.dropDatabase(Database_Names.hackathon)
      .then(() => {
        cb();
      })
    })
}

function installFailed(){
  clearDB(() => {
    console.log("Install ended...deleted all available databases");
  })
}

function doneInstall(){
  // setup .env variables
  let randomSessionVar = Math.floor(Math.random()*1000);
  let env = `
              PORT=4925
              SESSIONSECRET=${randomSessionVar}
              DB_URI=${db_uri}
              MODE=${mode}
            `

  console.log("Saving following session variables...");
  console.log(env + "\n");

  fs.writeFile(".env", env, function(err) {
    if(err) {
      console.error(`Failed to create collection:${err}\n Ending Install`);
      installFailed();
    } else {
      const runType = (mode === "dev") ? "npm run dev" : "npm start";
      const notMode = (mode === "dev") ? "live" : "dev";
      console.log(`Tomoe Server v${pack.version} installed for ${mode}, type\n ${runType} \n to use the server in ${mode} mode. \n\n REMINDER: You will need to run this installer again to set up a ${notMode} version of this server!`);
    }
  });
}


// export modules for testing
exports.startInstall = startInstall;
exports.installerPackage = installerPackage;
exports.checkIfTomoeInstanceInstalled = checkIfTomoeInstanceInstalled;
exports.askUserForEmail = askUserForEmail;
exports.askUserForPassword = askUserForPassword;
exports.askHackathonName = askHackathonName;
exports.installServerSoftware = installServerSoftware;
exports.clearDB = clearDB;
exports.installFailed = installFailed;
exports.doneInstall = doneInstall;
exports.setMode = setMode;
exports.db = db;
exports.getDatabaseNames = function(){
  return Database_Names;
}
