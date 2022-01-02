const { store } = require("../models");
const db = require("../models")
const Activity = db.activity
const User = db.user
const statusRes = require("../res.js");

exports.getActivities = async function(req, res) {
    var userId = req.query.userId
    var storeId = req.query.storeId

    try {
        const checkStore = await store.findOne({ where: { id: storeId }})
        if (checkStore === null) statusRes.notFound("Store and activity not found", res)
        else {
            const list = await Activity.findAll({
                where: {
                    userId: userId,
                    storeId: storeId
                },
                attributes: { exclude: ['userId', 'storeId'] },
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['password'] }
                    },
                    {
                        model: store,
                    }                
                ]
            })
            statusRes.ok(list, res)
        }
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}

exports.createActivity = async function(req, res) {
    var activity = req.body.activity
    var userId = req.body.userId
    var storeId = req.body.storeId

    if (activity === null) statusRes.badRequest("Activity must be filled", res)

    try {
        const checkStore = await store.findOne({ where: { id: storeId }})
        if (checkStore === null) statusRes.notFound("Store not found", res)
        else {
            var map = {
                activity: activity,
                userId: userId,
                storeId: storeId
            }
            const create = await db.activity.create(map)
            const activityData = await db.activity.findOne({
                where: { id: create.id },
                attributes: { exclude: ['userId', 'storeId'] },
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['password'] }
                    },
                    { model: db.store }
                ]
            })
            statusRes.postOk(activityData, "Activity has been created", res)            
        }
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}

exports.update = async function(req, res) {
    var activity = req.body.activity
    var id = req.body.id

    try {
        const checkActivity = await Activity.findOne({ where: { id: id }})
        if (checkActivity === null) statusRes.notFound("Activity not found", res)
        else {
            var map = {
                activity: activity ?? checkActivity.activity,
                userId: checkActivity.userId,
                storeId: checkActivity.storeId
            }
            await Activity.update(map, { where: { id: id }})
            const response = await Activity.findOne({ where: { id: id }})
            statusRes.postOk(response, "Activity has been updated", res)            
        }
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}

exports.deleteActivity = async function(req, res) {
    var id = req.body.id
    try {
        const activity = await Activity.findOne({where: {id: id}})
        if (activity) {
            await Activity.destroy({where: {id: id}})
            statusRes.postOk(activity, "Activity has been deleted", res)
        } else {
            statusRes.notFound("Activity not found", res)
        }
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}