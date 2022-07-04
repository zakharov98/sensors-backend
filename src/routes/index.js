const express = require('express');
const router = express.Router();
const sensors = require('./sensor.routes');

router.use('/sensors', sensors)

module.exports = router