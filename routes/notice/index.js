const router = require('express').Router()
const controller = require('./controller')

router.use("/",controller.notice)

module.exports = router