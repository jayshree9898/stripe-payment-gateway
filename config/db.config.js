const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    dialect: config.db.dialect,
    host: config.db.host
});


try {
    sequelize.authenticate();
    console.log("database connect successfully..");
} catch (error) {
    console.log(error);
}


const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//..........models
db.users = require('../model/user.model')(sequelize, Sequelize);
db.userSession = require('../model/userSession.model')(sequelize, Sequelize);

//relation
db.users.hasMany(db.userSession, { foreignKey: 'user_id' });
db.userSession.belongsTo(db.users, { foreignKey: 'user_id' });

db.sequelize.sync();
module.exports = db;