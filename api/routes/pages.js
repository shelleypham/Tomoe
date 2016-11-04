const path    = require("path");


module.exports = function(app, db){
  // all
  app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname+'/../../views/index.html'));
  });

  // begin server code
  app.get('/attendee', (req, res) => {

  });


};
