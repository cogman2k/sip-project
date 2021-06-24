var express = require('express');
var router = express.Router();

var totalVacationController = require('../controllers/averageBenefit.controller');

router.get('/', totalVacationController.index);

module.exports = router;