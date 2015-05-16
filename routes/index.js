var express = require('express');
var router = express.Router();
var passport = require("passport");

var User = require('../models/user');
var Medic = require('../models/medic');
var Nurse = require('../models/nurse');
var Floor = require('../models/floor');
var Staff = require('../models/staff');
var Patient = require('../models/patient');
var Diagnostic = require('../models/diagnostic');
var Sector = require('../models/sector');
var bedAssign = require('../models/bedAssign');



var loggedUser = undefined;


/* -------------------------  Home page ------------------------- */
router.get('/', function(req, res) {
  var msg = req.flash('message') || req.flash('success');
  if (msg.length == 0) msg = null;

  res.render('index', {user : loggedUser, message : msg, userNeeded: false});
  // res.render('index', {user : req.user, message : msg});
});


/* -------------------------  Log in ------------------------- */
router.get('/login', function(req, res) {
  var msg = req.flash('message') || req.flash('success');
  if (msg.length == 0) msg = null;

  res.render('login', {user: loggedUser, message: msg, userNeeded: false});
  //res.render('login', {user: req.user, message: msg});
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

  res.render('account', {user: loggedUser, message: msg, userNeeded: true});
  //res.render('signup', {user: req.user, message: msg});
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

  res.render('signup', {user: loggedUser, message: msg, userNeeded: false});
  //res.render('signup', {user: req.user, message: msg});
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

  res.render('query', {user: loggedUser, message: msg, userNeeded: true});
  //res.render('signup', {user: req.user, message: msg});
});
router.post('/query', function(req, res) {
  console.log(req.body);
  res.redirect('/query')
});

/* ------------------------- Export ------------------------- */
module.exports = router;
