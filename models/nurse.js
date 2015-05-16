var resourceful = require('resourceful');

var Nurse = module.exports = resourceful.define('nurse', function() {
  this.string('name1');
  this.string('name2');
  this.string('ap1');
  this.string('ap2');
  this.string('idFloor');

  this.timestamps();
});
