const router = require('express').Router()
const controller = require('./controller')
const loginMiddleware = require('../../middlewares/login')

router.get('/login',controller.loginPage);
router.post('/login',controller.login);

router.get('/register',controller.registerPage)
router.post('/register',controller.register);

router.get("/logout",loginMiddleware);
router.get('/logout',controller.logout);

router.use('/email',loginMiddleware);

router.get("/email",controller.emailPage);
router.post("/email",controller.emailAuth);

router.post("/resend_email",loginMiddleware);
router.post("/resend_email",controller.resendEmail);

router.get("/profile/:pk",loginMiddleware);
router.get("/profile/:pk",controller.profilePage);

router.get("/updatepf", loginMiddleware);
router.get("/updatepf", controller.updatepf);

router.post("/updatepf", loginMiddleware);
router.post("/updatepf", controller.Uprofile);

module.exports = router