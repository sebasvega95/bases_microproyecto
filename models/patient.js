var resourceful = require('resourceful');

var Patient = module.exports = resourceful.define('patient', function() {
  this.string('socialCare');
  this.string('name1');
  this.string('name2');
  this.string('ap1');
  this.string('ap2');
  this.string('birthDate')

  this.timestamps();
});
