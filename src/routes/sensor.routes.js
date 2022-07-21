const express = require('express');
const router = express.Router();
const sensors = require('../controllers/sensor.controller');

router.post('/', sensors.create);
router.get('/', sensors.findAll);
router.get('/charts', sensors.charts);

module.exports = router;