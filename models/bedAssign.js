var resourceful = require('resourceful');

var bedAssign = module.exports = resourceful.define('bedAssign', function() {
  this.string('idPatient');
  this.string('idMedic');
  this.string('idFloor');
  this.number('bedNum');
  this.string('initDate');
  this.string('endDate');

  this.timestamps();
});
