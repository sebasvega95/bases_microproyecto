var express = require('express');
var router = express.Router();
var passport = require("passport");

var Medic = require(__dirname + '/../models/medic');
var Nurse = require(__dirname + '/../models/nurse');
var Floor = require(__dirname + '/../models/floor');
var Staff = require(__dirname + '/../models/staff');
var Patient = require(__dirname + '/../models/patient');
var Diagnostic = require(__dirname + '/../models/diagnostic');
var Sector = require(__dirname + '/../models/sector');
var bedAssign = require(__dirname + '/../models/bedAssign');

var diagNum = {};
var sectorNum = {};
var patientNum = {};
var medic_nurseNum = {};

var date1;
var date2;

var datesStatistics;

function empty(strs) {
  for (var i = 0; i < strs.length; i++) {
    if (!strs[i] || strs[i] == '')
      return true;
  }
  return false;
}

function validDate(y, m, d) {
  var daysInMonth;
  switch (m) {
    case 1 :
      daysInMonth = (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
    case 8 : case 3 : case 5 : case 10 :
      daysInMonth = 30;
    default :
    daysInMonth = 31
  }

  return m >= 0 && m < 12 && d > 0 && d <= daysInMonth;
}

function findDiagNum(callback) {
  Diagnostic.all(function (err, data) {
    if (err) {
      console.log("Data error");
      return callback(err);
    }
    for (var i = 0; i < data.length; i++) {
      (function(i) {
        if (!diagNum[data[i].type])
          diagNum[data[i].type] = 1;
        else
          diagNum[data[i].type]++;

        if (i + 1 == data.length)
          return findSectorNum(callback);
      })(i);
    }
  });
}

function findSectorNum(callback) {
  Diagnostic.all(function (err, data) {
    if (err) {
      console.log("Data error");
      return callback(err);
    }
    for (var i = 0; i < data.length; i++) {
      (function(i) {
        Medic.get(data[i].idMedic, function (err, dataMedic) {
          if (!sectorNum[dataMedic.idSector])
            sectorNum[dataMedic.idSector] = 1;
          else
            sectorNum[dataMedic.idSector]++;

          if (i + 1 == data.length)
            return findPatientNum(callback);
        });
      })(i);
    }
  });
}

function findPatientNum(callback) {
  Diagnostic.all(function (err, data) {
    if (err) {
      console.log("Data error");
      return callback(err);
    }
    for (var i = 0; i < data.length; i++) {
      (function(i) {
        if ( !patientNum[data[i].idPatient] ) {
          patientNum[data[i].idPatient] = {};
          patientNum[data[i].idPatient]["n"] = 1;
        }
        else
          patientNum[data[i].idPatient]["n"]++;

        if ( !((patientNum[data[i].idPatient])[data[i].type]) )
          patientNum[data[i].idPatient][data[i].type] = 1;
        else
          patientNum[data[i].idPatient][data[i].type]++;

        if (i + 1 == data.length) {
          if (datesStatistics)
            return findMedic_NurseNum(callback);
          else
            return callback(null, diagNum, sectorNum, patientNum, null);
        }
      })(i);
    }
  });
}

function findMedic_NurseNum(callback) {
  Diagnostic.all(function (err, data) {
    if (err) {
      console.log("Data error");
      return callback(err);
    }
    for (var i = 0; i < data.length; i++) {
      (function(i) {
        var aux = data[i].date.split("-");
        var dateAux = new Date(+aux[2], +aux[1] - 1, +aux[0]);

        console.log(dateAux);

        if (date1.getTime() <= dateAux.getTime() && dateAux.getTime() <= date2.getTime()) {
          if (!medic_nurseNum[data[i].idMedic])
            medic_nurseNum[data[i].idMedic] = [];
          if (!medic_nurseNum[data[i].idNurse])
            medic_nurseNum[data[i].idNurse] = [];

          if (medic_nurseNum[data[i].idMedic].indexOf(data[i].idPatient) == -1)
            medic_nurseNum[data[i].idMedic].push(data[i].idPatient);

          if (medic_nurseNum[data[i].idNurse].indexOf(data[i].idPatient) == -1)
            medic_nurseNum[data[i].idNurse].push(data[i].idPatient);
        }

        if (i + 1 == data.length)
          return callback(null, diagNum, sectorNum, patientNum, medic_nurseNum);
      })(i);
    }
  });
}

var Statistics = module.exports = function(_date1, _date2, callback) {
  if (!_date1 || !_date2)
    datesStatistics = false;
  else if (empty(_date1) || empty(_date2))
    datesStatistics = false;

  if (!validDate(+_date1[0], (+_date1[1] - 1), +_date1[2]) || !validDate(+_date2[0], (+_date2[1] - 1), +_date2[2]))
    datesStatistics = false;
  else
    datesStatistics = true;

  date1 = new Date(+_date1[0], +_date1[1] - 1, +_date1[2]);
  date2 = new Date(+_date2[0], +_date2[1] - 1, +_date2[2]);

  console.log(date1);
  console.log(date2);
  console.log("Started date query");

  diagNum = {};
  sectorNum = {};
  patientNum = {};
  medic_nurseNum = {};

  return findDiagNum(callback);
}
