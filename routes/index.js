var express = require('express');
var router = express.Router();
var passport = require("passport");

var User = require('../models/user');
var Query = require('./query');
var Add = require('./add');
var Statistics = require('./statistics')

var loggedUser = undefined;

/* -------------------------  Home page ------------------------- */
router.get('/', function(req, res) {
  var msg = req.flash('message') || req.flash('success');
  if (msg.length == 0) msg = null;

  res.render('index', {user : loggedUser, message : msg});
});


/* -------------------------  Log in ------------------------- */
router.get('/login', function(req, res) {
  var msg = req.flash('message') || req.flash('success');
  if (msg.length == 0) msg = null;

  res.render('login', {user: loggedUser, message: msg});
});

router.post('/login', function(req, res) {
  User.find({name: req.body.name, password: req.body.password},
    function(err, data) {
      if (err) {
        console.log('Error : ', err);
        return res.send(500, err);
      }

      if (data.length == 0) {
        req.flash('message', 'Datos incorrectos!!');
        res.redirect('login');
      }
      else {
        loggedUser = data[0];
        req.flash('message', 'Bienvenido, te extrañamos ' + data[0].name);
        res.redirect('/');
      }
  });
});


/* ------------------------- Account management ------------------------- */
router.get('/account', function(req, res) {
  var msg = req.flash('message') || req.flash('success');
  if (msg.length == 0) msg = null;

  if (typeof loggedUser == 'object' && loggedUser)
    res.render('account', {user: loggedUser, message: msg});
  else
    res.render('noUser', {user: loggedUser, message: msg});
});

router.post('/account', function(req, res) {
  if (req.body.oldPsw != loggedUser.password) {
    req.flash('message', 'Contraseña incorrecta!!');
    res.redirect('/account');
  }
  else if (req.body.newPsw != req.body.newPswConfirm) {
    req.flash('message', 'Las contraseñas no coinciden!!');
    res.redirect('/account');
  }
  else {
    User.update(loggedUser.id, {password: req.body.newPsw}, function(err, data) {
      loggedUser.password = req.body.newPsw;

      req.flash('message', "Cambios guardados con éxito!!");
      res.redirect('/');
    });
  }
});

router.post('/logout', function(req, res) {
  loggedUser = undefined;
  req.flash('message', "Sesión cerrada con éxito, esperamos que nos volvamos a encontrar");
  res.redirect('/');
});


/* ------------------------- Sign up a new user ------------------------- */
router.get('/signup', function(req, res) {
  var msg = req.flash('message') || req.flash('success');
  if (msg.length == 0) msg = null;

  res.render('signup', {user: loggedUser, message: msg});
});

router.post('/signup', function(req, res) {
  if (req.body.password !== req.body.passwordConfirm) {
    req.flash('message', 'Las contraseñas no coinciden!!');
    res.redirect('/signup');
  }
  else {
    User.find({name : req.body.name},
      function(err, data) {
        if (err) {
          console.log('Error : ', err);
          return res.send(500, err);
        }

        if (data.length != 0) {
          req.flash('message', 'El usuario ya existe!!');
          res.redirect('/signup');
        }
        else if (req.body.name == '' || req.body.password == '') {
          req.flash('message', 'Error al crear el susuario');
          res.redirect('/signup');
        }
        else {
          User.create({ name : req.body.name,
                        id: req.body.name,
                        password: req.body.password,
                        isAdmin: (req.body.isAdmin == 'on' ? true : false)
                       },
            function(err, data) {
              if (err) {
                console.log('Error : ', err);
                return res.send(500, err);
              }

              loggedUser = data;
              req.flash('message', 'Usuario creado con éxito!!');
              res.redirect('/');
            });
        }
    });
  }
});


/* ------------------------- Queries ------------------------- */
router.get('/query', function(req, res) {
  var msg = req.flash('message') || req.flash('success');
  if (msg.length == 0) msg = null;

  if (typeof loggedUser == 'object' && loggedUser)
    res.render('query', {user: loggedUser, message: msg, tableHeader: null, table: null});
  else
    res.render('noUser', {user: loggedUser, message: msg});
});

router.post('/query', function(req, res) {
  console.log("query :D");
  Query(req.body.tableName, req.body.filterBy, req.body.filter, function(err, name, head, data) {
    if (err) {
      console.log('Error : ', err);
      return res.send(500, err);
    }

    res.render('query', {user: loggedUser, tableName: name, tableHeader: head, table: data});
  });
});

/* ------------------------- Add to tables ------------------------- */
router.get('/add', function(req, res) {
  var msg = req.flash('message') || req.flash('success');
  if (msg.length == 0) msg = null;

  if (typeof loggedUser == 'object' && loggedUser)
    res.render('add', {user: loggedUser, message: msg});
  else
    res.render('noUser', {user: loggedUser, message: msg});
});

router.post('/add', function(req, res) {
  var newEntry = req.body;

  Add(newEntry, function(err) {
    if (err) {
      console.log(err);
      req.flash('message', 'Hubo un error al ingresar la entrada, porfavor revise los campos (ERRCODE: ' + err + ")");
      res.redirect('/add');
    }
    else {
      req.flash('message', "Entrada añadida con éxito");
      res.redirect('/add');
    }
  });
});

/* ------------------------- Statistics ------------------------- */
router.get('/statistics', function(req, res) {
  var msg = req.flash('message') || req.flash('success');
  if (msg.length == 0) msg = null;

  if (!(typeof loggedUser == 'object' && loggedUser))
    res.render('noUser', {user: loggedUser, message: msg});
  else {
    Statistics("", "", function (err, diagNumData, sectorNumData, patientNumData, medic_nurseNumData) {
      if (err) {
        console.log(err);
        req.flash('message', 'Hubo un error al recuperar los datos');
        res.redirect('/');
      }
      else {
        res.render('statistics', {user: loggedUser, message: msg,
                                  diagNum: diagNumData,
                                  sectorNum: sectorNumData,
                                  patientNum: patientNumData,
                                  medic_nurseNum: medic_nurseNumData});
      }
    });
  }
});

router.post('/statistics', function(req, res) {
  var dates = req.body;
  console.log(req.body);

  var msg = req.flash('message') || req.flash('success');
  if (msg.length == 0) msg = null;

  var date1 = [req.body.year1, req.body.month1, req.body.day1];
  var date2 = [req.body.year2, req.body.month2, req.body.day2];

  // res.redirect('/statistics');

  Statistics(date1, date2, function (err, diagNumData, sectorNumData, patientNumData, medic_nurseNumData) {
    if (err) {
      console.log(err);
      req.flash('message', 'Hubo un error al recuperar los datos');
      res.redirect('/add');
    }
    else {
      res.render('statistics', {user: loggedUser, message: msg,
                                diagNum: diagNumData,
                                sectorNum: sectorNumData,
                                patientNum: patientNumData,
                                medic_nurseNum: medic_nurseNumData});
    }
  });
});

/* ------------------------- Export ------------------------- */
module.exports = router;
