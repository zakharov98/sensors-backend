const { GoogleSpreadsheet } = require('google-spreadsheet');
const db = require('../models');
const Sensor = db.sensors;

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
    if (process.env.ENABLE_GOOGLE_SHEETS === 'true') {
      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
      await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      });
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      await sheet.addRow({ sensorId: sensor.sensorId, temp1: sensor.temp1, temp2: sensor.temp2, temp3: sensor.temp3, temp4: sensor.temp4, temp5: sensor.temp5, hum1: sensor.hum1, hum2: sensor.hum2, rain: sensor.rain, batLevel: sensor.batLevel, createdAt: sensor.createdAt });
    }
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