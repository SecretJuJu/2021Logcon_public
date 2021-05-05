const router = require('express').Router()
const express = require('express')
const main = require('./main')
const member = require('./member')
const challenges = require('./challenges')
const app = express()
const admin = require('./admin')
const rank = require('./rank')
const notice = require('./notice')
const helmet = require('helmet')



app.use(helmet());
router.use('/member', member)
router.use('/challenges',challenges)
router.use('/admin',admin)
router.use('/rank',rank)
router.use('/notice',notice)
router.use('/',main)

module.exports = router