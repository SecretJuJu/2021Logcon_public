const router = require('express').Router()
const controller = require('./controller')


router.get('/',controller.main);

module.exports = router