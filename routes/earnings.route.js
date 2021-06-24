var express = require('express');
var router = express.Router();

var ceoController = require('../controllers/earnings.controller');

router.get('/', ceoController.index);

module.exports = router;