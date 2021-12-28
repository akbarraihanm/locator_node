module.exports = app => {
    const controller = require("../controller/user.controller")
    const express = require('express');
    const path = require('path');
    var router = express.Router()
    
    app.use("/api/users", router)
    app.use("/files/idcard", express.static(path.join(__dirname, '../../public/files/idcard')))

    //GET
    
    //POST
    router.post("/create", controller.createUser[0], controller.createUser[1], controller.createUser[2])
    router.post("/login", controller.login)
    router.post('/logout', controller.logout)
}