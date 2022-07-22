const { GoogleSpreadsheet } = require('google-spreadsheet');
const db = require('../models');
const sequelize = db.sequelize;
const Sensor = db.sensors;

exports.create = async (req, res) => {
  const f1 = req.body.f1;
  let [ sensorId, m1, m2, m3, m4, m5, m6, t1, t2, hour, minute, day, month, year ] = f1.split(';');

  sensorId = parseInt(sensorId);
  m1 = parseFloat(m1);
  m2 = parseFloat(m2);
  m3 = parseFloat(m3);
  m4 = parseFloat(m4);
  m5 = parseFloat(m5);
  m6 = parseFloat(m6);
  t1 = parseFloat(t1);
  t2 = parseFloat(t2);
  hour = parseInt(hour);
  minute = parseInt(minute);
  day = parseInt(day);
  month = parseInt(month);
  year = parseInt(year);

  try {
    const sensor = await Sensor.create({
      sensorId,
      m1,
      m2,
      m3,
      m4,
      m5,
      m6,
      t1,
      t2,
      hour,
      minute,
      day,
      month,
      year,
    });
    if (process.env.ENABLE_GOOGLE_SHEETS === 'true') {
      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
      await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      });
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      await sheet.addRow({ sensorId: sensor.sensorId, m1: sensor.m1, m2: sensor.m2, m3: sensor.m3, m4: sensor.m4, m5: sensor.m5, m6: sensor.m6, t1: sensor.t1, t2: sensor.t2, hour: sensor.hour, minute: sensor.minute, day: sensor.day, month: sensor.month, year: sensor.year });
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

exports.charts = async (req, res) => {
  try {
    const [allData, metadataR1] = await sequelize.query(`SELECT "id", "sensorId", "m1", "m2", "m3", "m4", "m5", "m6", "t1", "t2", concat_ws(':', "hour", "minute") as "time", concat_ws('.', "day", "month", "year") as "date" FROM "sensors" ORDER BY id DESC LIMIT 500`);
    const [groupedData, metadataR2] = await sequelize.query(`SELECT AVG("m1") as "m1", AVG("m2") as "m2", AVG("m3") as "m3", AVG("m4") as "m4", AVG("m5") as "m5", AVG("m6") as "m6", AVG("t1") as "t1", AVG("t2") as "t2", concat_ws('.', "day", "month", "year") as "date", "sensorId" FROM "sensors" GROUP BY "date", "sensorId" ORDER BY "date"`);
    res.send({
      status: true,
      data: {
        grouped: groupedData,
        all: allData,
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error: { msg: error.message || "Some error occurred while retrieving  Sensors." }
    });
  }
};