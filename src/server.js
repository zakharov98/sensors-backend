const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./models');
const router = require('./routes');

db.sequelize.sync({ alter: true });
//db.sequelize.sync({ alter: true });
//db.sequelize.sync({ force: true }).then(() => { console.log("Drop and re-sync db."); });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router)

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});