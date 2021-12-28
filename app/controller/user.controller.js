const db = require("../models")
const User = db.user
const statusRes = require("../res.js")
const bcrypt = require('bcrypt')
const saltRounds = 10
const fs = require('fs');
var mimeTypeNotAccepted = ""
var fileName = ""

var multer = require('multer')
var baseUrl = process.env.BASE_URL 
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var dir = fileUrl+'/public/files/idcard'
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true})
        } 
        cb(null, fileUrl+'/public/files/idcard')
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

exports.createUser = [
    upload.single('file'),
    function(err, req, res, next) {
        if (err) {
            statusRes.badRequest(err.message, res)
        } else { next() }
    },
    async function(req, res) {
    
        var name = req.body.name
        var idCard = req.body.idCard
        var username = req.body.username
        var password = req.body.password
        var email = req.body.email;
        var imgPath = ""
    
        if (name == null && username == null && password == null && idCard == null && email == null) {
            statusRes.badRequest("Fields cannot be empty", res)
        } else {
            try {
                const user = await User.findOne({
                    where: {username: username}
                })
                if (user) {
                    statusRes.badRequest("Username cannot be used", res)
                } else {
                    const hashPassword = bcrypt.hashSync(password, saltRounds)
                    if (mimeTypeNotAccepted) {
                        statusRes.badRequest(mimeTypeNotAccepted, res)
                        mimeTypeNotAccepted = ""
                    } else {
                        imgPath = baseUrl+`/files/idcard/${fileName}`
                        var map = {
                            name: name,
                            idCard: idCard,
                            username: username,
                            img: imgPath,
                            email: email,
                            password: hashPassword
                        }
                        if (fileName === "") {
                            statusRes.badRequest("File must be filled", res)
                        } else {
                            var created = await User.create(map)
                            var returned = {
                                id: created.id,
                                name: name,
                                idCard: idCard,
                                img: imgPath,
                                username: username,
                                email: email,
                                createdAt: created.createdAt,
                                updatedAt: created.updatedAt
                            }
                            statusRes.postOk(returned, "User has been created", res)
                        }
                    }                    
                }
            } catch (error) {
                statusRes.internalServerError(error.message, res)
            }
        }
    }
]

exports.login = async function(req, res) {
    var username = req.body.username
    var password = req.body.password

    if (username == null) {
        statusRes.badRequest("Username must be filled", res)
    } 
    if (password == null) {
        statusRes.badRequest("Password must be filled", res)
    }
    try {
        const user = await User.findOne({where: {username: username}})
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                const returned = await User.findOne({
                    where: {username: username},
                    attributes: {exclude: ['password']}
                })
                statusRes.postOk(returned, "Login success", res)
            } else {
                statusRes.badRequest("Wrong password", res)
            }
        } else {
            statusRes.notFound("User not found", res)
        }
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}

exports.logout = async function(req, res) {
    var username = req.body.username
    try {
        const user = await User.findOne({where: {username: username}})
        if (user) {
            const returned = await User.findOne({
                where: {username: username},
                attributes: {exclude: ['password']}
            })
            statusRes.postOk(returned, "Logout success", res)
        } else {
            statusRes.notFound("User not found", res)
        }
    } catch (error) {
        statusRes.internalServerError(error.message, res)
    }
}