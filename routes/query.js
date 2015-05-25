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
  var table = [];
  var tableHeader;
  switch (tableName) {
    case "medic": { // Mostrar médicos
      tableHeader = ["ID", "Nombre", "Apellidos", "Área"];
      Medic.all(function(err, data) {
        if (err)
          return callback(err);

        for (var i = 0; i < data.length; i++) {
          if (filterBy == '' || data[i][filterBy] == filter.toUpperCase()) {
            var sector;
            Sector.find(data[i].idSector, function (err, dataSector) { sector = (err ? null : dataSector); });
            table.push([data[i].id,
                        (data[i].name1 + " " + data[i].name2),
                        (data[i].ap1 + " " + data[i].ap2),
                        dataSector[i].name]);
          }
        }

        callback(null, "Médicos", tableHeader, table);
      });
      break;
    }
    case "nurse": { // Mostrar enfermeros
      tableHeader = ["ID", "Nombre", "Apellidos", "Piso"];
      Nurse.all(function(err, data) {
        if (err)
          return callback(err);

        for (var i = 0; i < data.length; i++) {
          if (filterBy == '' || data[i][filterBy] == filter.toUpperCase()) {
            var floor;
            Floor.find(data[i].idFloor, function (err, dataFloor) { floor = (err ? null : dataFloor); });
            table.push([data[i].id,
                            (data[i].name1 + " " + data[i].name2),
                            (data[i].ap1 + " " + data[i].ap2),
                            dataFloor[i].name]);
          }
        }

        callback(null, "Enfermeros", tableHeader, table);
      });
      break;
    }
    case "floor": { // Mostrar los pisos
      tableHeader = ["ID", "Tipo", "Número de camas", "Enfermero encargado"];
      Floor.all(function(err, data) {
        if (err)
          return callback(err);

        for (var i = 0; i < data.length; i++) {
          if (filterBy == '' || data[i][filterBy] == filter.toUpperCase()) {
            var nurse;
            Nurse.find(data[i].idFloor, function (err, dataNurse) { nurse = (err ? null : dataNurse); });
            table.push([data[i].id,
                        data[i].type,
                        data[i].nBeds,
                        (dataNurse[i].name1 + " " + dataNurse[i].ap2)]);
          }
        }

        callback(null, "Pisos", tableHeader, table);
      });
      break;
    }
    case "staff": { // Mostrar los funcionarios
      tableHeader = ["ID", "Nombre", "Apellidos", "Cargo"];
      Staff.all(function(err, data) {
        if (err)
          return callback(err);

        for (var i = 0; i < data.length; i++) {
          if (filterBy == '' || data[i][filterBy] == filter.toUpperCase()) {
          table.push([data[i].id,
                      (data[i].name1 + " " + data[i].name2),
                      (data[i].ap1 + " " + data[i].ap2),
                      data[i].charge]);
          }
        }

        callback(null, "Personal", tableHeader, table);
      });
      break;
    }
    case "patient": { // Mostrar los pacientes
      tableHeader = ["DNI", "Nro. seguro social", "Nombre", "Apellidos", "Fec. nacimiento"];
      Patient.all(function(err, data) {
        if (err)
          return callback(err);

        for (var i = 0; i < data.length; i++) {
          if (filterBy == '' || data[i][filterBy] == filter.toUpperCase()) {
            table.push([data[i].id,
                        data[i].socialCare,
                        (data[i].name1 + " " + data[i].name2),
                        (data[i].ap1 + " " + data[i].ap2),
                        data[i].birthDate]);
          }
        }

        callback(null, "Pacientes", tableHeader, table);
      });
      break;
    }
    case "diagnostic": { // Mostrar los diagnósticos
      tableHeader = ["ID", "Médico", "Enfermero", "Paciente", "Tipo", "Descripción", "Fecha"];
      Diagnostic.all(function(err, data) {
        if (err)
          return callback(err);

        for (var i = 0; i < data.length; i++) {
          if (filterBy == '' || data[i][filterBy] == filter.toUpperCase()) {
            var medic, nurse, patient;
            Medic.find(data[i].idMedic, function (err, dataMedic) { medic = (err ? null : dataMedic); });
            Nurse.find(data[i].idNurse, function (err, dataNurse) { nurse = (err ? null : dataNurse); });
            Patient.find(data[i].idPatient, function (err, dataPatient) { patient = (err ? null : dataPatient); });

            table.push([data[i].id,
                        (medic.name1 + " " + medic.ap1),
                        (nurse.name1 + " " + nurse.name2),
                        (patient.ap1 + " " + patient.ap2),
                        data[i].type,
                        data[i].desc,
                        data[i].date]);
          }
        }

        callback(null, "Diagnósticos", tableHeader, table);
      });
      break;
    }
    case "sector": { // Mostrar las áreas
      tableHeader = ["ID", "Área", "Médico en jefe"];
      Sector.all(function(err, data) {
        if (err)
          return callback(err);

        for (var i = 0; i < data.length; i++) {
          if (filterBy == '' || data[i][filterBy] == filter.toUpperCase()) {
            var medic;
            Medic.find(data[i].idMedic, function (err, dataMedic) { medic = (err ? null : dataMedic); });
            table.push([data[i].id,
                        data[i].name,
                        (medic.name1 + " " + medic.ap1)]);
          }
        }

        callback(null, "Sectores",tableHeader, table);
      });
      break;
    }
    case "bedAssign": { // Asignación de camas
      tableHeader = ["ID", "Piso", "Nro. de cama", "Paciente", "Fec. ingreso", "Fec. fin"];
      bedAssign.all(function(err, data) {
        if (err)
          return callback(err);

        for (var i = 0; i < data.length; i++) {
          if (filterBy == '' || data[i][filterBy] == filter.toUpperCase()) {
            var patient, floor;
            Patient.find(data[i].idPatient, function (err, dataPatient) { patient = (err ? null : dataPatient); });
            Floor.find(data[i].idPatient, function (err, dataFloor) { floor = (err ? null : dataFloor); });
            table.push([data[i].id,
                        (floor.id + " - " + floor.type),
                        data[i].bedNum,
                        (patient.name1 + " " + patient.ap1),
                        data[i].initDate,
                        data[i].endDate]);
          }
        }

        callback(null, "Asignación de camas", tableHeader, table);
      });
      break;
    }
  }
}
