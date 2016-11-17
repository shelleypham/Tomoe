// Test if database installs properly
const install = require("../../setup/install.js");
const utilities = require("../../api/tools/util.js");
const Database = require('arangojs').Database;
const db = new Database(process.env.DB_URI);
      db.useDatabase("dev_tomoe_admin");

module.exports = function(assert, request, should){

    // setup class
    let test_InstallerPackage = {
      email:utilities.createKey([5]).key + "@gmail.com",
      temp_password:utilities.createKey([4]).key,
      hackathon_name:utilities.createKey([2]).key,
    }

    let installer = new install.installerPackage(test_InstallerPackage.email);

    describe('Class InstallerPackage', function() {

      before(function(){
        describe('#constructor()', function() {
          it('adds a email', function() {
            assert.equal(test_InstallerPackage.email, installer.returnInstaller().email);
          });
        });

        describe('#addHackathon()', function() {
          it('Adds a hackathon name', function() {
            installer.addHackathon(test_InstallerPackage.hackathon_name)
            assert.equal(test_InstallerPackage.hackathon_name, installer.returnInstaller().hackathon_name);

          });
        });
      });

      describe('#addPassword()', function() {
        installer.setPassword(test_InstallerPackage.temp_password)
        let valid_password = utilities.validate.password(test_InstallerPackage.temp_password, installer.returnInstaller().password);

        it('Adds Password', function() {
          assert.isTrue(valid_password);
        });


        it('Deletes the temporary password', function() {
          assert.equal(installer.returnInstaller().temp_password, null);
        });
      });

      after(function() {
        describe('#assign()', function() {
          let user = installer.assign();

          it('Returns a user', function() {
            should.exist(user._key);
            should.exist(user.email);
            should.exist(user.password);
          });
        });

        describe('#save()', function() {
          it('Saves a user', function() {
            installer.save(db, db.collection('users'), installer, function(){
              installer.findByEmail(db, db.collection('users'), user.email, function(user_ret){
                assert.equal(user_ret.email, user.email);
              }, function(err){
                assert.equal(true, false);
                throw err;
              });
            }, function(err){
              assert.equal(true, false);
              throw err;
            });
          });
          });


      });
    });
};
