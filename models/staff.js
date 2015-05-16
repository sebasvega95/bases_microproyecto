var resourceful = require('resourceful');

var Staff = module.exports = resourceful.define('staff', function() {
  this.string('name1');
  this.string('name2');
  this.string('ap1');
  this.string('ap2');
  this.string('charge');

  this.timestamps();
});
