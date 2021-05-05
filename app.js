const express = require('express')
const app = express()
const sequelize = require('./models/index').sequelize;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const session = require('express-session');

const PORT = 3000
app.use(session({
    secret: '122345564fasdfafa54fsadaf', 
    resave: false,  
    saveUninitialized: true, 
}));
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static('public'))
app.use('/', require('./routes/index'))
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(function(req, res, next) {
    res.status(404).render('404',{data:req.session});
  });


app.listen(PORT,"0.0.0.0",()=>{
    const driver = async () => {
        try {
            await sequelize.sync();
        } catch (err) {
            console.error('database sycn failed');
            console.error(err);
            return;
        }
     
        console.log('database sync success');
    };
    driver(); // sequelize sync
    console.log("the server is running")
})