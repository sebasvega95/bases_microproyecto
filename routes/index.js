var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/logout', function(req, res, next) {
  res.send('logout');
});

router.get('/account', function(req, res, next) {
  res.send('account');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

module.exports = router;
