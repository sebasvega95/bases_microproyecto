var resourceful = require('resourceful');

var Diagnostic = module.exports = resourceful.define('diagnostic', function() {
  this.string('idMedic');
  this.string('idPatient');
  this.string('idNurse');
  this.string('type');
  this.string('desc');
  this.string('date');

  this.timestamps();
});
