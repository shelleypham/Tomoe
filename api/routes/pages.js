const path    = require("path");

module.exports = function(app, keys) {


  // all
  app.get('/', function(req, res){
      res.sendFile(path.join(__dirname+'/../../views/index.html'));
  });


};
