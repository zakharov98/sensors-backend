module.exports = (sequelize, Sequelize) => {
    return sequelize.define('sensor', {
        sensorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        temp1: {
            type: Sequelize.FLOAT,
        },
        temp2: {
            type: Sequelize.FLOAT,
        },
        temp3: {
            type: Sequelize.FLOAT,
        },
        temp4: {
            type: Sequelize.FLOAT,
        },
        temp5: {
            type: Sequelize.FLOAT,
        },
        hum1: {
            type: Sequelize.FLOAT,
        },
        hum2: {
            type: Sequelize.FLOAT,
        },
    });
};