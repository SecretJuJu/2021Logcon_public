const router = require('express').Router()
const controller = require('./controller')
const adminMiddleware = require('../../middlewares/admin')

router.use("/CNotice",adminMiddleware)
router.use("/CChall",adminMiddleware)
router.use("/DMember",adminMiddleware)
router.use("/DChall",adminMiddleware)
router.use("/UChall",adminMiddleware)
router.use("/DNotice",adminMiddleware)

router.get("/CNotice",(req,res)=>{res.render("CNotice")})
router.get("/CChall", (req,res)=>{res.render("CChall")})
router.get("/DMember",controller.DMemberList)
router.get("/DMember/:pk", controller.DMember)
router.get("/DChall",controller.DChallList)
router.get("/DChall/:pk",controller.DChall)
router.get("/UChall",controller.UChallList)
router.get("/UChall/:pk",controller.UChall)
router.get("/DNotice",controller.DNoticeList)
router.get("/DNotice/:pk",controller.DNotice)

router.post("/CNotice",controller.CNotice)
router.post("/CChall",controller.CChall)
router.post("/DMember",controller.DMember)
router.post("/DChall",controller.DChall)
router.post("/UChall/:pk",controller.UChallAct)
router.post("/DNotice",controller.DNotice)



router.use("/",adminMiddleware)
router.get("/",controller.adminPage)



module.exports = router