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
      email:this.email,
      password:this.password,
    }
  }

  get(){
    return {
      email:this.email,
    }
  }

  setPassword(password){
    let new_pass = utilities.generate.saltAndHash(password);
    this.password = new_pass;

    this.temp_password = null; // sets any temp password to none
  }



  static findById(db, collection, id_optional, resolve, reject){
    let id = (id_optional) ? id_optional : this._id;

    db.query(aql`
        FOR u IN ${collection.name}
          FILTER u._id == ${id}
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

  static findByEmail(db, collection, email_optional, resolve, reject){
    let email = (email_optional) ? email_optional : this.email;

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
            console.log(err)
            reject(err);
          }
        );
      },
      err => {
        console.log(err)
        reject(err);
      }
    )
  }

  save(db, collection, resolve, reject){
    // check if email already exists
    let new_user = this.assign();

    user.findByEmail(db, collection, function(user){
      if(user){
          reject("user exists");
      } else {
        collection.save(new_user).then(
          meta => {
            resolve(meta);
          },
          err => {
            reject(err);
          }
        );
      }
    }, function(err){
      reject(err);
    });
  }

  destroy(db, collection, resolve, reject){
    this.findByEmail(db, collection, function(user){
      if(user){
        collection.removeByExample(user);
      } else {
        reject("no user found");
      }
    }, function(err){
      reject(err);
    });
  }

  update(db, collection, resolve, reject){
    // check if email already exists
    let updated_user_data = this.get();
    this.findByEmail(db, collection, function(user){
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
    }, function(err){
      reject(err);
    });
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
    this.survey = user_package.survey;
  }
}

class staff extends user{
  constructor(user_package){
    super(user_package.email)
    this.survey = user_package.survey;
  }
}



exports.admin = admin;
exports.staff = staff;
exports.hacker = hacker;
