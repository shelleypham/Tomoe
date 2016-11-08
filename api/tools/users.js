const aql = require('arangojs').aql;
const utilities = require('../tools/util.js');

class user{
  constructor(email){
    this.email = email;
    this.password = null;
  }

  assign(){
    return {
      _key:utilities.createKey([4,6,3]),
      username:this.username,
      password:this.password,
    }
  }

  get(){
    return {
      username:this.username,
    }
  }

  setPassword(password){
    let new_pass = utilities.generate.saltAndHash(password);
    this.password = new_pass;

    this.temp_password = null; // sets any temp password to none
  }

  save(db, collection, resolve, reject){
    // check if username already exists
    let user = this.assign();
    this.findByUsername(db, collection, function(user){
      if(user){
          reject("user exists");
      } else {
        collection.save(user).then(
          meta => {
            resolve(meta);
          },
          err => {
            reject(err);
          }
        );
      }
    }, reject(err));
  }

  destroy(db, collection, resolve, reject){
    this.findByUsername(db, collection, function(user){
      if(user){
        collection.removeByExample(user);
      } else {
        reject("no user found");
      }
    }, reject(err));
  }

  update(db, collection, resolve, reject){
    // check if username already exists
    let updated_user_data = this.get();
    this.findByUsername(db, collection, function(user){
      if(user){
        collection.update(user, updated_user_data).then(
          meta => {
            resolve(meta);
          },
          err => {
            reject(err);
          }
        );
      } else {
        reject("no user found")
      }
    }, reject(error))
  }

  static findByUsername(db, collection, username_optional, resolve, reject){
    let username = (username_optional) username_optional ? this.username;

    db.query(aql`
        FOR u IN ${collection.name}
          FILTER u.username == ${username}
          RETURN u
    `)
    .then(cursor => {
      cursor.all()
          .then(users => {
            if(users && users[0] && users[0].username){
              resolve(users[0]);
            } else {
              resolve(false);
            }
          },
          err => {
            reject(err);
          }
        );
      },
      err => {
        reject(err);
      }
    )
  }

  static findByEmail(db, collection, email_optional, resolve, reject){
    let email = (email_optional) email_optional ? this.email;

    db.query(aql`
        FOR u IN ${collection.name}
          FILTER u.email == ${email}
          RETURN u
    `)
    .then(cursor => {
      cursor.all()
          .then(users => {
            if(users && users[0] && users[0].email){
              resolve(users[0]);
            } else {
              resolve(false);
            }
          },
          err => {
            reject(err);
          }
        );
      },
      err => {
        reject(err);
      }
    )
  }

}

class admin extends user{
  constructor(user_package){
    super(user_package.email);
    this.rank = user_package.rank; // "all" for now
  }
}


class hacker extends user{
  constructor(user_package){
    super(user_package.email)
    this.survery = user_package.survery;
  }
}

class staff extends user{
  constructor(user_package){
    super(user_package.email)
    this.survery = user_package.survery;
  }
}



exports.admin = admin;
