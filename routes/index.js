var express = require('express');
var usuario = require("../model/ADM")

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
