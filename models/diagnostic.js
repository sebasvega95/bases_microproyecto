var resourceful = require('resourceful');

var Diagnostic = module.exports = resourceful.define('diagnostic', function() {
  this.string('idMedic');
  this.string('idPatient');
  this.string('idNurse');
  this.string('desc');

  this.timestamps();
});
