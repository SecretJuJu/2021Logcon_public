const Sequelize = require('sequelize')
const config = require("../config/config.json")
var db = {}

db_config = config.db_connection
var sequelize = new Sequelize(
    db_config.database, 
    db_config.username, 
    db_config.password, 
    db_config
); 

db.sequelize = sequelize
db.Sequelize = Sequelize

db.Member = require('./Member')(sequelize, Sequelize)
db.Challenge = require('./Challenge')(sequelize, Sequelize)
db.Solved = require('./Solved')(sequelize, Sequelize)
db.Notice = require('./Notice')(sequelize, Sequelize)

module.exports = db