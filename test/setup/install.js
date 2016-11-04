// Test if database installs properly
const install = require("../../setup/install.js")();


module.exports = function(assert, request, should){
  describe('Array', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function() {
        assert.equal(-1, 1);
      });
    });
  });

}
