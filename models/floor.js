var resourceful = require('resourceful');

var Floor = module.exports = resourceful.define('floor', function() {
  this.string('type');
  this.number('nBeds');
  this.number('idBoss')

  this.timestamps();
});
