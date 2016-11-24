const path    = require("path");
const utilities    = require("../tools/util.js");
const user    = require("../tools/users.js");


module.exports = function(app, db){
  // all
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/../../views/index.html'));
  });

  app.get('/hackers', (req, res) => {

  });

  app.get('/hackers/:user_input', (req, res) => {
    const user_input = req.param.user_input;
    const isEmail = utilities.validate.email(user_input);

    function foundUser(found_user){
      if (found_user){
        res.send(found_user, 200);
      } else{
        res.send("User can't be found.", 404);
      }
    }

    function userFailed(err){
      res.send(err, 500);
    }

    if (isEmail){
      user.findByEmail(db, collection, user_input, foundUser, userFailed);
    } else{
      user.findById(db, collection, user_input, foundUser, userFailed);
    }

  });

  app.post('/hackers', (req, res) => {
    let new_hacker = new hacker(req.body);

    new_hacker.save(db, collection, function(found_user){
      // resolve function
      res.send(found_user, 200);
    }, function(err){
      // reject function
      res.send("User can't be created: " + err, 500);
    });
  });

  app.post('/hackers/:user_input', (req, res) => {
    const user_input = req.param.user_input;
    const isEmail = utilities.validate.email(user_input);

    if (isEmail){
      user.update(db, collection, function(found_user) {
        res.send(found_user, 200);
      }, function(err){
        res.send("User can't be updated: " + err, 500);
      })
    } else{

    }
  });

  app.delete('/hackers/:user_input', (req, res) => {
    const user_input = req.param.user_input;
    const isEmail = utilities.validate.email(user_input);

    if (isEmail){
      user.destroy(db, collection, function(found_user) {
        res.send(found_user, 200);
      }, function(err){
        res.send("User can't be deleted: " + err, 500);
      })
    } else{

    }
  });

};
