module.exports = app => {
    const controller = require("../controller/activity.controller")
    const express = require('express')
    var router = express.Router()

    app.use('/api/activities', router)

    //GET
    router.get('/', controller.getActivities)

    //POST
    router.post('/create', controller.createActivity)
    router.post('/update', controller.update)
    router.post('/delete', controller.deleteActivity)
}