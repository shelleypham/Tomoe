const sha256 = require('js-sha256');
const crypto = require('crypto');

class Key{
  constructor(values){
    let key = "";

    for(let i of values){
      keys += crypto.randomBytes(values[i]).toString('hex');
    }

    this.key = key;

    return keys;
  }
}

const util = {
  createKey:function(values){
    return new Key(values);
  },
  saltAndHash:function(resolve){
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
    resolve(salt + sha256(pass + salt));
  }
}


module.exports = util;
