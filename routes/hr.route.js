var express = require('express');
var router = express.Router();

var hrController = require('../controllers/hr.controller');

router.get('/', hrController.index);

router.get('/create', hrController.create);
router.post('/create', hrController.postCreate);

router.get('/:id', hrController.edit);
router.post('/:id', hrController.postEdit);

router.get('/delete/:id', hrController.deleteEmployee);

module.exports = router;
