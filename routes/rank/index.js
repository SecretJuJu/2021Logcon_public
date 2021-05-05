const router = require('express').Router()
const controller = require('./controller')
const loginMiddleware = require('../..//middlewares/login')
const emailMiddleware = require('../..//middlewares/email')

router.get("/",loginMiddleware)
router.get("/",emailMiddleware)
router.get("/",controller.ranking)

module.exports = router