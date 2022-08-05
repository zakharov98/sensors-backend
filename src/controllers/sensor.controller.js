const { GoogleSpreadsheet } = require('google-spreadsheet');
const db = require('../models');
const sequelize = db.sequelize;
const Sensor = db.sensors;

exports.create = async (req, res) => {
  try {
    const f1 = req.body.f1;
    let [sensorId, m1, m2, m3, m4, m5, m6, t1, t2, hour, minute, day, month, year] = f1.split(';');

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
    year = parseInt(year) + 2000;

    if (day === 0) {
      const lastRow = await Sensor.findOne({
        order: [['createdAt', 'DESC']],
      });
      const lastDate = new Date(lastRow.year, lastRow.month, lastRow.day, lastRow.hour, lastRow.minute, 0, 0);
      const newDate = new Date(lastDate.getTime() + 15 * 60000);
      hour = newDate.getHours();
      minute = newDate.getMinutes();
      day = newDate.getDate();
      month = newDate.getHours();
      year = newDate.getFullYear();
    }

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
      try {
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
        await doc.useServiceAccountAuth({
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY,
        });
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        const idx = rows.length + 2;
        await sheet.addRow({ sensorId: sensor.sensorId, m1: sensor.m1, m2: sensor.m2, m3: sensor.m3, m4: sensor.m4, m5: sensor.m5, m6: sensor.m6, t1: sensor.t1, t2: sensor.t2, hour: sensor.hour, minute: sensor.minute, day: sensor.day, month: sensor.month, year: sensor.year, time: `=ВРЕМЯ(P${idx};Q${idx};0)`, date: `=ДАТА(T${idx};S${idx};R${idx})` });
      } catch (error) {
        console.log(error.message);
      }
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
    const [sensors, metadataR1] = await sequelize.query(`SELECT "id", "sensorId", "m1", "m2", "m3", "m4", "m5", "m5", "m6", "t1", "t2", LPAD("hour"::text, 2, '0') as "hour", LPAD("minute"::text, 2, '0') as "minute", LPAD("day"::text, 2, '0') as "day", LPAD("month"::text, 2, '0') as "month", "year", "createdAt", "updatedAt" FROM "sensors"`);
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
    const offset = req.query?.offset ? parseInt(req.query.offset) : (req.body?.offset ? req.body.offset : 0);
    const count = req.query?.count ? parseInt(req.query.count) : (req.body?.count ? req.body.count : 100);
    const [sensors, metadataR1] = await sequelize.query(`SELECT "sensorId" FROM "sensors" GROUP BY "sensorId" ORDER BY "sensorId"`);
    let data = [];
    for (let index = 0; index < sensors.length; index++) {
      const sensor = sensors[index];
      const [groupedData, metadataR2] = await sequelize.query(`SELECT "id", "m1", "m2", "m3", "m4", "m5", "m6", "t1", "t2", concat_ws(' ', concat_ws('.', LPAD("day"::text, 2, '0'), LPAD("month"::text, 2, '0'), "year"), concat_ws(':', LPAD("month"::text, 2, '0'), LPAD("month"::text, 2, '0'))) as "datetime" FROM "sensors" WHERE "sensorId"=${sensor.sensorId} ORDER BY id DESC LIMIT ${count} OFFSET ${offset}`);
      data.push({ sensorId: sensor.sensorId, data: groupedData });
    }
    res.send({
      status: true,
      data: data
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error: { msg: error.message || "Some error occurred while retrieving  Sensors." }
    });
  }
};