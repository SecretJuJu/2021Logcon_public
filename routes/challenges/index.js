const router = require('express').Router()
const controller = require('./controller')
const loginMiddleware = require('../../middlewares/login')
const emailMiddleware = require('../../middlewares/email')

router.get("/",loginMiddleware)
router.get("/",emailMiddleware)
router.get("/",controller.challenges)

router.get("/detail/:num",loginMiddleware)
router.get("/detail/:num",emailMiddleware)
router.get("/detail/:num",controller.show_detail)

router.post("/detail/:num",loginMiddleware)
router.post("/detail/:num",emailMiddleware)
router.post("/detail/:num",controller.flag)

module.exports = router