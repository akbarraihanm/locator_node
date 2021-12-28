const db = require("../models")
const statusRes = require("../res.js");

exports.create = async function(req, res) {
    var day = req.body.day
    var userId = req.body.userId
    var storeId = req.body.storeId

    if (day === null) statusRes.badRequest("Day must be filled", res)

    try {
        const checkUser = await db.user.findOne({ where: { id: userId }})
        const checkStore = await db.store.findOne({ where: { id: storeId}})
        if (checkUser === null) statusRes.notFound("User not found", res)
        if (checkStore === null) statusRes.notFound("Store not found", res)
        var map = {
            day: day,
            userId: userId,
            storeId: storeId
        }
        var create = await db.visitSchedule.create(map)
        var response = await db.visitSchedule.findOne({ 
            where: { id: create.id },
            attributes: { exclude: ['userId', 'storeId'] },
            include: [
                {
                    model: db.user,
                    attributes: { exclude: ['password'] }
                },
                { model: db.store }
            ]
        })
        statusRes.postOk(response, "Schedule has been created", res)
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}

exports.get = async function(req, res) {
    var userId = req.query.userId
    var storeId = req.query.storeId

    try {
        const checkUser = await db.user.findOne({ where: { id: userId }})
        const checkStore = await db.store.findOne({ where: { id: storeId}})
        if (checkUser === null) statusRes.notFound("User not found", res)
        if (checkStore === null) statusRes.notFound("Store not found", res)

        const schedules = await db.visitSchedule.findAll({
            where: {
                userId: userId,
                storeId: storeId
            },
            attributes: { exclude: ['userId', 'storeId'] },
            include: [
                {
                    model: db.user,
                    attributes: { exclude: ['password'] }
                },
                { model: db.store }
            ]
        })
        statusRes.ok(schedules, res)
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}

exports.update = async function(req, res) {
    var day = req.body.day
    var id = req.body.id

    try {
        const checkSchedule = await db.visitSchedule.findOne({ where: { id: id }})
        if (checkSchedule === null) statusRes.notFound("Schedule not found", res)
        var map = {
            day: day ?? checkSchedule.day,
            userId: checkSchedule.userId,
            storeId: checkSchedule.storeId
        }
        await db.visitSchedule.update(map, { where: { id: id }})
        const response = await db.visitSchedule.findOne({ where: { id: id }})
        statusRes.postOk(response, "Schedule has been updated", res)
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}