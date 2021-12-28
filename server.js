const express = require('express')
const cors = require('cors')
require('dotenv').config({path: __dirname + '/.env'});

const app = express()

var corsOptions = {
    origin: `http://localhost:${process.env.PORT}`
};

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.json({"message": "Welcome to Locator backend"})
})

require("./app/routes/activity.route")(app)
require("./app/routes/user.route")(app)
require("./app/routes/order.route")(app)
require("./app/routes/store.route")(app)
require("./app/routes/absence.route")(app)
require("./app/routes/visit_schedule.route")(app)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`)
})

const db = require("./app/models")
db.sequelize.sync()