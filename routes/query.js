var express = require('express');
var router = express.Router();
var passport = require("passport");

var Medic = require('../models/medic');
var Nurse = require('../models/nurse');
var Floor = require('../models/floor');
var Staff = require('../models/staff');
var Patient = require('../models/patient');
var Diagnostic = require('../models/diagnostic');
var Sector = require('../models/sector');
var bedAssign = require('../models/bedAssign');

var Query = module.exports = function(tableName, filterBy, filter, callback) {
  table = []
  if (filterBy == '') {
    switch (tableName) {
      case "medic": {
        Medic.all(function(err, data) {
          
        });
        break;
      }
      case "nurse": {

        break;
      }
      case "floor": {

        break;
      }
      case "staff": {

        break;
      }
      case "patient": {

        break;
      }
      case "diagnostic": {

        break;
      }
      case "sector": {

        break;
      }
      case "bedAssign": {

        break;
      }
    }
  }
  else {

  }
}
