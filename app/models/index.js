const dbConfig = require("../config/db.config.js")

const Sequelize = require("sequelize")
const seq = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = seq

db.activity = require("./activity.model.js")(seq, Sequelize)
db.user = require("./user.model")(seq, Sequelize)
db.store = require("./store.model")(seq, Sequelize)
db.order = require("./order.model")(seq, Sequelize)
db.absence = require("./absence.model")(seq, Sequelize)
db.visitSchedule = require("./visit_schedule.model")(seq, Sequelize)

//Relations//
db.user.hasMany(db.store)
db.store.belongsTo(db.user)
db.store.hasMany(db.order)
db.activity.belongsTo(db.user)
db.activity.belongsTo(db.store)
db.order.belongsTo(db.user)
db.order.belongsTo(db.store)
db.absence.belongsTo(db.user)
db.absence.belongsTo(db.store)
db.visitSchedule.belongsTo(db.user)
db.visitSchedule.belongsTo(db.store)

module.exports = db;