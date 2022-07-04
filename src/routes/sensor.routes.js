const express = require('express');
const router = express.Router();
const sensors = require('../controllers/sensor.controller');

router.post('/', sensors.create);
router.get('/', sensors.findAll);

module.exports = router;