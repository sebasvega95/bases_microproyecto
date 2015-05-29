var express = require('express');
var router = express.Router();
var passport = require("passport");
var fs = require("fs");

var Medic = require(__dirname + '/../models/medic');
var Nurse = require(__dirname + '/../models/nurse');
var Floor = require(__dirname + '/../models/floor');
var Staff = require(__dirname + '/../models/staff');
var Patient = require(__dirname + '/../models/patient');
var Diagnostic = require(__dirname + '/../models/diagnostic');
var Sector = require(__dirname + '/../models/sector');
var bedAssign = require(__dirname + '/../models/bedAssign');

function trans(str) {
  for (var i=0;i<str.length;i++){
    if (str.charAt(i)=="á") str = str.replace(/á/,"a");
    if (str.charAt(i)=="é") str = str.replace(/é/,"e");
    if (str.charAt(i)=="í") str = str.replace(/í/,"i");
    if (str.charAt(i)=="ó") str = str.replace(/ó/,"o");
    if (str.charAt(i)=="ú") str = str.replace(/ú/,"u");
  }
  return str.toUpperCase();
}

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

module.exports = function Add(newEntry, callback) {
  console.log(newEntry);

  if (empty([newEntry.tableName]))
    return callback("No table");

  switch (newEntry.tableName) {
    case "medic": {
      if (empty([newEntry.id, newEntry.name1, newEntry.ap1, newEntry.ap2, newEntry.idSector]))
        return callback("Data missing");

      Medic.get(newEntry.id, function (err, data) {
          if (!err || (data && data.length != 0))
            return callback("Already exists");
          Sector.get(newEntry.idSector, function (err, dataSector) {
            if (err || dataSector.length == 0)
              return callback("No entry");
            Medic.create({id: newEntry.id,
                          name1: trans(newEntry.name1),
                          name2: trans(newEntry.name2),
                          ap1: trans(newEntry.ap1),
                          ap2: trans(newEntry.ap2),
                          idSector: newEntry.idSector},
              function (err, data) {
                if (err)
                  return callback(err);
                console.log("Created ok");
                return callback(null);
            });
          });
      });
      break;
    }
    case "nurse": {
      if (empty([newEntry.id, newEntry.name1, newEntry.ap1, newEntry.ap2, newEntry.idFloor]))
        return callback("Data missing");

      Nurse.get(newEntry.id, function (err, data) {
        if (!err || (data && data.length != 0))
          return callback("Already exists");
        Floor.get(newEntry.idFloor, function (err, data) {
          if (err || data.length == 0)
            return callback("No entry");
          console.log("creating")
          Nurse.create({id: newEntry.id,
                        name1: trans(newEntry.name1),
                        name2: trans(newEntry.name2),
                        ap1: trans(newEntry.ap1),
                        ap2: trans(newEntry.ap2),
                        idFloor: newEntry.idFloor},
            function (err, data) {
              if (err)
                return callback(err);
              console.log("Created ok");
              return callback(null);
          });
        });
      });
      break;
    }
    case "staff": {
      if (empty([newEntry.id, newEntry.name1, newEntry.ap1, newEntry.ap2, newEntry.charge]))
        return callback("Data missing");

      Staff.get(newEntry.id, function (err, data) {
        if (!err || (data && data.length != 0))
          return callback("Already exists");
        Staff.create({id: newEntry.id,
                      name1: trans(newEntry.name1),
                      name2: trans(newEntry.name2),
                      ap1: trans(newEntry.ap1),
                      ap2: trans(newEntry.ap2),
                      charge: trans(newEntry.charge)},
          function (err, data) {
            if (err)
              return callback(err);
            console.log("Created ok");
            return callback(null);
        });
      });
      break;
    }
    case "patient": {
      if (empty([newEntry.id, newEntry.socialCare, newEntry.name1, newEntry.ap1, newEntry.ap2, newEntry.year, newEntry.month, newEntry.day]) || isNaN(newEntry.id) || isNaN(newEntry.socialCare) || Number(newEntry.id) < 0 || Number(newEntry.socialCare) < 0)
        return callback("Data missing");

      Patient.get(newEntry.id, function (err, data) {
        if (!err || (data && data.length != 0))
          return callback("Already exists");
        Patient.create({id: newEntry.id,
                        socialCare: newEntry.socialCare,
                        name1: trans(newEntry.name1),
                        name2: trans(newEntry.name2),
                        ap1: trans(newEntry.ap1),
                        ap2: trans(newEntry.ap2),
                        birthDate: newEntry.day + "-" + newEntry.month + "-" + newEntry.year},
          function (err, data) {
            if (err)
              return callback(err);
            console.log("Created ok");
            return callback(null);
        });
      });
      break;
    }
    case "diagnostic": {
      if (empty([newEntry.idMedic, newEntry.idNurse, newEntry.idPatient, newEntry.year, newEntry.month, newEntry.day, newEntry.type, newEntry.desc]) || isNaN(newEntry.idPatient) || newEntry.idPatient < 0)
        return callback("Data missing");

      Medic.get(newEntry.idMedic, function (err, data) {
        if (err || data.length == 0)
          return callback("No entry");
        Nurse.get(newEntry.idNurse, function (err, data) {
          if (err || data.length == 0)
            return callback("No entry");
          Patient.get(newEntry.idPatient, function (err, data) {
            if (err || data.length == 0)
              return callback("No entry");
            Diagnostic.create({idMedic: newEntry.idMedic,
                               idNurse: newEntry.idNurse,
                               idPatient: newEntry.idPatient,
                               type: trans(newEntry.type),
                               desc: newEntry.desc,
                               date: newEntry.day + "-" + newEntry.month + "-" + newEntry.year},
              function (err, data) {
                if (err)
                  return callback(err);
                console.log("Created ok");
                return callback(null);
            });
          });
        });
      });
      break;
    }
    case "bedAssign": {
      if (empty([newEntry.idPatient, newEntry.idFloor, newEntry.year1, newEntry.month1, newEntry.day1, newEntry.year2, newEntry.month2, newEntry.day2]) || isNaN(newEntry.bedNum) || Number(newEntry.bedNum) < 0)
        return callback("Data missing");

      if (!validDate(+newEntry.year1, (+newEntry.month1 - 1), +newEntry.day1))
        return callback("Invalid date");
      if (!validDate(+newEntry.year2, (+newEntry.month2 - 1), +newEntry.day2))
        return callback("Invalid date");

      var f1 = new Date(+newEntry.year1, (+newEntry.month1 - 1), +newEntry.day1);
      var f2 = new Date(+newEntry.year2, (+newEntry.month2 - 1), +newEntry.day2);

      if (f1.getTime() > f2.getTime())
        return callback("First date is in the future")

      Patient.get(newEntry.idPatient, function (err, data) {
         if (err || data.length == 0)
           return callback("No entry");
         Floor.get(newEntry.idFloor, function (err, data) {
           if (err || data.length == 0)
             return callback("No entry");
           else if( newEntry.bedNum > data.nBeds)
             return callback("Bed limit exceeded");
           bedAssign.create({idPatient: newEntry.idPatient,
                             idFloor: newEntry.idFloor,
                             bedNum: Number(newEntry.bedNum),
                             initDate: newEntry.day1 + "-" + newEntry.month1 + "-" + newEntry.year1,
                             endDate: newEntry.day2 + "-" + newEntry.month2 + "-" + newEntry.year2},
            function (err, data) {
              if (err)
                return callback(err);
              console.log("Created ok");
              return callback(null);
          });
        });
      });
      break;
    }
  }
}
