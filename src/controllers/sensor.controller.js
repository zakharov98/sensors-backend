const { GoogleSpreadsheet } = require('google-spreadsheet');
const db = require('../models');
const Sensor = db.sensors;
const Op = db.Sequelize.Op;
const creds = require('../config/sensors-backend-9330f0d4ab1d.json')

exports.create = async (req, res) => {
  const { sensorId, temp1, temp2, temp3, temp4, temp5, hum1, hum2, rain, batLevel } = req.body;
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
      rain,
      batLevel,
    });
    const doc = new GoogleSpreadsheet('1LZPqn8fE5MYDWQ7s2tuyg2yuQpMKuNgsespPEEma7gY');
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({ sensorId: sensor.sensorId, temp1: sensor.temp1, temp2: sensor.temp2, temp3: sensor.temp3, temp4: sensor.temp4, temp5: sensor.temp5, hum1: sensor.hum1, hum2: sensor.hum2, rain: sensor.rain, batLevel: sensor.batLevel, createdAt: sensor.createdAt });
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