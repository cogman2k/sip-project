var express = require('express');
var router = express.Router();

var payrollController = require('../controllers/payroll.controller');

router.get('/', payrollController.index);

router.get('/create', payrollController.create);
router.post('/create', payrollController.postCreate);

router.get('/:id', payrollController.edit);
router.post('/:id', payrollController.postEdit);

router.get('/delete/:id', payrollController.deleteEmployee);

module.exports = router;
