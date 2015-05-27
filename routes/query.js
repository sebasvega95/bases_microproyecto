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

function trans(str) {
  for (var i=0;i<str.length;i++){
    if (str.charAt(i)=="á") str = str.replace(/á/,"a");
    if (str.charAt(i)=="é") str = str.replace(/é/,"e");
    if (str.charAt(i)=="í") str = str.replace(/í/,"i");
    if (str.charAt(i)=="ó") str = str.replace(/ó/,"o");
    if (str.charAt(i)=="ú") str = str.replace(/ú/,"u");
    if (str.charAt(i)=="Á") str = str.replace(/Á/,"a");
    if (str.charAt(i)=="É") str = str.replace(/É/,"e");
    if (str.charAt(i)=="Í") str = str.replace(/Í/,"i");
    if (str.charAt(i)=="Ó") str = str.replace(/Ó/,"o");
    if (str.charAt(i)=="Ú") str = str.replace(/Ú/,"u");
  }
  return str.toUpperCase();
}

var Query = module.exports = function(tableName, filterBy, filter, callback) {
  var tableHeader;
  var table = [];

  var tmp = {};
  if (filterBy != '')
    tmp[((filterBy == "id") ? "_" : "") + filterBy] = ((filterBy == "id") ? (tableName + "/") : "") + trans(filter);
  console.log(tmp);

  switch (tableName) {
    case "medic": { // Mostrar médicos
      tableHeader = ["ID", "Nombre", "Apellidos", "Área"];

      Medic.find(tmp, function (err, data) {
        if (err)
           return callback(err);

        if (data.length == 0)
          return callback(null, "Médicos", tableHeader, table);

        for (var i = 0; i < data.length; i++) {
          (function(i) {
            Sector.get(data[i].idSector, function (err, dataSector) {
              if (err)
                return callback(err);
              table.push([data[i].id,
                          (data[i].name1 + " " + data[i].name2),
                          (data[i].ap1 + " " + data[i].ap2),
                          dataSector.name]);

              if (table.length == data.length)
                return callback(null, "Médicos", tableHeader, table);
            });
          })(i);
        }
      });
      break;
    }
    case "nurse": { // Mostrar enfermeros
      tableHeader = ["ID", "Nombre", "Apellidos", "Piso"];

      Nurse.find(tmp, function (err, data) {
        if (err)
           return callback(err);

        if (data.length == 0)
          return callback(null, "Enfermeros", tableHeader, table);

        for (var i = 0; i < data.length; i++) {
          (function(i) {
            Floor.get(data[i].idFloor, function (err, dataFloor) {
              if (err)
                return callback(err);

              table.push([data[i].id,
                          (data[i].name1 + " " + data[i].name2),
                          (data[i].ap1 + " " + data[i].ap2),
                          dataFloor.type]);

              if (table.length == data.length)
                return callback(null, "Enfermeros", tableHeader, table);
            });
          })(i);
        }
      });
      break;
    }
    case "staff": { // Mostrar los funcionarios
      tableHeader = ["ID", "Nombre", "Apellidos", "Cargo"];

      Staff.find(tmp, function (err, data) {
        if (err)
           return callback(err);

        if (data.length == 0)
          return callback(null, "Personal", tableHeader, table);

        for (var i = 0; i < data.length; i++) {
          (function(i) {
            table.push([data[i].id,
                        (data[i].name1 + " " + data[i].name2),
                        (data[i].ap1 + " " + data[i].ap2),
                        data[i].charge]);

            if (table.length == data.length)
              return callback(null, "Personal", tableHeader, table);
          })(i);
        }
      });
      break;
    }
    case "patient": { // Mostrar los pacientes
      tableHeader = ["DNI", "Nro. seguro social", "Nombre", "Apellidos", "Fec. nacimiento"];

      Patient.find(tmp, function (err, data) {
        if (err)
           return callback(err);

        if (data.length == 0)
          return callback(null, "Pacientes", tableHeader, table);

        for (var i = 0; i < data.length; i++) {
          (function(i) {
            table.push([data[i].id,
                        data[i].socialCare,
                        (data[i].name1 + " " + data[i].name2),
                        (data[i].ap1 + " " + data[i].ap2),
                        data[i].birthDate]);

            if (table.length == data.length)
              return callback(null, "Pacientes", tableHeader, table);
          })(i);
        }
      });
      break;
    }
    case "diagnostic": { // Mostrar los diagnósticos
      tableHeader = ["Médico", "Enfermero", "Paciente", "Tipo", "Descripción", "Fecha"];

      Diagnostic.find(tmp, function (err, data) {
        if (err)
           return callback(err);

        if (data.length == 0)
          return callback(null, "Diagnósticos", tableHeader, table);

        for (var i = 0; i < data.length; i++) {
          (function(i) {
            Medic.get(data[i].idMedic, function (err, dataMedic) {
              if (err)
                return callback(err);
              Nurse.get(data[i].idNurse, function (err, dataNurse) {
                if (err)
                  return callback(err);
                Patient.get(data[i].idPatient, function (err, dataPatient) {
                  if (err)
                    return callback(err);
                  table.push([(dataMedic.id + ": " + dataMedic.name1 + " " + dataMedic.ap1),
                              (dataNurse.id + ": " + dataNurse.name1 + " " + dataNurse.ap1),
                              (dataPatient.id + ": " + dataPatient.name1 + " " + dataPatient.ap1),
                              data[i].type,
                              data[i].desc,
                              data[i].date]);
                  if (table.length == data.length)
                    return callback(null, "Diagnósticos", tableHeader, table);
                });
              });
            });
          })(i);
        }
      });
      break;
    }
    case "bedAssign": { // Asignación de camas
      tableHeader = ["Piso", "Nro. de cama", "Paciente", "Fec. ingreso", "Fec. fin"];

      bedAssign.find(tmp, function (err, data) {
        if (err)
           return callback(err);

        if (data.length == 0)
          return callback(null, "Asignación de camas", tableHeader, table);

        for (var i = 0; i < data.length; i++) {
          (function(i) {
            Patient.get(data[i].idPatient, function (err, dataPatient) {
              if (err)
                return callback(err);
              Floor.get(data[i].idFloor, function (err, dataFloor) {
                if (err)
                  return callback(err);

              table.push([(dataFloor.id + ": " + dataFloor.type),
                          data[i].bedNum,
                          (dataPatient.id + ": " + dataPatient.name1 + " " + dataPatient.ap1),
                          data[i].initDate,
                          data[i].endDate]);
              if (table.length == data.length)
                return callback(null, "Asignación de camas", tableHeader, table);
              });
            });
          })(i);
        }
      });
      break;
    }
  }
}
