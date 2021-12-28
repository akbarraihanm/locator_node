const db = require("../models")
const statusRes = require("../res.js");
const fs = require('fs');
var mimeTypeNotAccepted = ""
var fileName = ""

var multer = require('multer')
var baseUrl = process.env.BASE_URL 
var fileUrl = process.env.FILE_URL
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var dir = fileUrl+'/public/files/absence'
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true})
        } 
        cb(null, fileUrl+'/public/files/absence')
    },
    filename: function(req, file, cb) {
        var mimeType = file.mimetype.split("/")
        fileName = Date.now()+"."+mimeType[1]
        cb(null, fileName)
    }
})

var upload = multer({storage: storage, limits: {fileSize: 1000000}, 
    fileFilter: function(req, file, cb) {
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
            cb(null, false)
            mimeTypeNotAccepted = "The image must be png, jpg or jpeg"
        } else {
            cb(null, true)
            mimeTypeNotAccepted = null
        }
    }
})

exports.create = [
    upload.single('file'),
    function(err, req, res, next) {
        if (err) {
            statusRes.badRequest(err.message, res)
        } else { next() }
    },
    async function(req, res) {
        var latLng = req.body.latLng
        var userId = req.body.userId
        var storeId = req.body.storeId
        var imgPath = ""        

        try {
            const checkUser = await db.user.findOne({ where: { id: userId }})
            const checkStore = await db.store.findOne({ where: {id: storeId }})
            if (checkUser === null) statusRes.notFound("User not found", res)
            if (checkStore === null) statusRes.notFound("Store not found", res)
            if (mimeTypeNotAccepted) {
                statusRes.badRequest(mimeTypeNotAccepted, res)
                mimeTypeNotAccepted = ""
            } else {
                if (fileName === "") statusRes.badRequest("File must be filled", res)
                imgPath = baseUrl+`/files/absence/${fileName}`
                var map = {
                    latLng: latLng,
                    userId: userId,
                    storeId: storeId,
                    img: imgPath
                }
                var create = await db.absence.create(map)
                var absence = await db.absence.findOne({
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
                statusRes.postOk(absence, "Absence created successfully", res)
            }            
        } catch (error) {
            statusRes.internalServerError(error.message, res)
        }
    }
]

exports.get = async function(req, res) {
    var storeId = req.query.storeId
    var userId = req.query.userId

    try {
        const checkStore = await db.store.findOne({ where: { id: storeId }})
        const checkUser = await db.user.findOne({ where: { id: userId }})
        if (checkStore === null) statusRes.notFound("Store not found", res)
        if (checkUser === null) statusRes.notFound("User not found", res)
        const absences = await db.absence.findAll({
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
        statusRes.ok(absences, res)
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}

exports.delete = async function(req, res) {
    var id = req.body.id

    try {
        const absence = await db.absence.findOne({ where: { id: id }})
        if (absence === null) statusRes.notFound("Absence not found", res)
        await db.absence.destroy({ where: { id: id }})
        statusRes.postOk(absence, "Absence has been deleted", res)
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}