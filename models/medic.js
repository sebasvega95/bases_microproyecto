var resourceful = require('resourceful');

var Medic = module.exports = resourceful.define('medic', function() {
  this.string('name1');
  this.string('name2');
  this.string('ap1');
  this.string('ap2');
  this.string('idArea');

  this.timestamps(); //Time marks
});
