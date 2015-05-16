var resourceful = require('resourceful');

var Sector = module.exports = resourceful.define('sector', function() {
  this.string('name');
  this.string('idMedic');
  this.timestamps();
});
