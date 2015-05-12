var express = require('express');
var User = require('../models/user');
var router = express.Router();
var passport = require("passport");

/* GET home page. */
router.get('/', function(req, res) {
  var msg = req.flash('message') || req.flash('success');
  if (msg.length == 0) msg = null;
  res.render('index', {user : req.user, message : msg});
});

/* -----  Log in -----*/
router.get('/login', function(req, res) {
  res.render('login');
});
/*router.post('/login', function(req, res) {
  var msg = req.flash('message') || req.flash('success');
  if (msg.length == 0) msg = null;
  res.render('login', {user: req.user, message: msg});

  User.find({name: req.body.name, password: req.body.password},
    function(err, data) {
      if (err) {
        console.log('Error : ', err);
        return res.send(500, err);
      }

      if (data.length == 0) {
        req.flash('message', 'Datos incorrectos!!');
        res.redirect('/login');
      }
      else {

      }
  });
});*/

/* ----- Log out -----*/
router.get('/logout', function(req, res) {
  res.send('logout');
});

/* ----- Account management -----*/
router.get('/account', function(req, res) {
  res.send('account');
});

/* ----- Sign up a new user ----- */
router.get('/signup', function(req, res) {
  var msg = req.flash('message') || req.flash('success');
  if (msg.length == 0) msg = null;
  res.render('signup', {user: req.user, message: msg});
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
                        password: req.body.password,
                        isAdmin: (req.body.isAdmin == 'on' ? true : false)
                       },
            function(err, data) {
              if (err) {
                console.log('Error : ', err);
                res.send(500, err);
              }
              else {
                req.flash('message', 'Usuario creado con éxito!!');
                res.redirect('/');
                }
              });
            }
    });
  }
});

module.exports = router;
