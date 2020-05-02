const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to Anyway Authorization and Cache Server'});
});

module.exports = router;
