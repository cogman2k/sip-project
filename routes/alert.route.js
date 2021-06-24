var express = require('express');
var router = express.Router();

var totalVacationController = require('../controllers/alert.controller');

router.get('/', totalVacationController.index);

module.exports = router;