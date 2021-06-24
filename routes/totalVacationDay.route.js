var express = require('express');
var router = express.Router();

var totalVacationController = require('../controllers/totalVacationDay.controller');

router.get('/', totalVacationController.index);

module.exports = router;