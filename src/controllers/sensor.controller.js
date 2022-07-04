const db = require('../models');
const Sensor = db.sensors;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  const { sensorId, temp1, temp2, temp3, temp4, temp5, hum1, hum2 } = req.body;
  try {
    const sensor = await Sensor.create({
      sensorId,
      temp1,
      temp2,
      temp3,
      temp4,
      temp5,
      hum1,
      hum2,
    });
    res.send({
      status: true,
      data: sensor
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      error: { msg: error.message || "Some error occurred while creating the Sensor." }
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const sensors = await Sensor.findAll();
    res.send({
      status: true,
      data: sensors
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      error: { msg: error.message || "Some error occurred while retrieving  Sensors." }
    });
  }
};