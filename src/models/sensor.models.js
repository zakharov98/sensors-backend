module.exports = (sequelize, Sequelize) => {
    return sequelize.define('sensor', {
        sensorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        m1: {
            type: Sequelize.FLOAT,
        },
        m2: {
            type: Sequelize.FLOAT,
        },
        m3: {
            type: Sequelize.FLOAT,
        },
        m4: {
            type: Sequelize.FLOAT,
        },
        m5: {
            type: Sequelize.FLOAT,
        },
        m6: {
            type: Sequelize.FLOAT,
        },
        t1: {
            type: Sequelize.FLOAT,
        },
        t2: {
            type: Sequelize.FLOAT,
        },
        hour: {
            type: Sequelize.INTEGER,
        },
        minute: {
            type: Sequelize.INTEGER,
        },
        day: {
            type: Sequelize.INTEGER,
        },
        month: {
            type: Sequelize.INTEGER,
        },
        year: {
            type: Sequelize.INTEGER,
        },
    });
};