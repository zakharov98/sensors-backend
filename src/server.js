require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./models');
const router = require('./routes');
const cors = require('cors');

db.sequelize.sync({ alter: true });
//db.sequelize.sync({ alter: true });
//db.sequelize.sync({ force: true }).then(() => { console.log("Drop and re-sync db."); });

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router)

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    console.log(`Google Sheet is ${process.env.ENABLE_GOOGLE_SHEETS === 'true' ? 'enabled' : 'disabled'}`);
});