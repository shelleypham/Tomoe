const sha256 = require('js-sha256');
const crypto = require('crypto');

class Key{
  constructor(values){
    if(values){
      let key = "";


      for(let i in values){
        key += crypto.randomBytes(values[i]).toString('hex');
      }

      this.key = key;

      return key;
    } else {
      throw err()
    }

  }
}

const util = {
  createKey:function(values){
    return new Key(values);
  },
  validate:{
    password: function(plainPass, hashedPass, resolve){
  		const salt = hashedPass.substr(0, 10);
  		const validHash = salt + sha256(plainPass + salt);
      const truth = (hashedPass === validHash);

      if(resolve){
        resolve(truth); // async
      } else {
        return truth;
      }

    },
  },
  generate:{
    saltAndHash:function(pass, resolve){
      function generateSalt(){
          let set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
          let salt = '';
          for (let i = 0; i < 10; i++) {
              let p = Math.floor(Math.random() * set.length);
              salt += set[p];
          }
          return salt;
      }

      let salt = generateSalt();
      let new_pass = (salt + sha256(pass + salt));

      if(resolve){
         resolve(new_pass);
      } else {
        return new_pass;
      }

    }
  }
}


module.exports = util;
