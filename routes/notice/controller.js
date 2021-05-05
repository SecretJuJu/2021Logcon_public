const Notice = require("../../models/index").Notice
const sequelize =require('sequelize')
exports.notice = (req,res) => {
    Notice.findAll({
        attributes: ['pk','title','content',
        [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d %h:%m:%s'), 'createdAt']], // set date format
        raw:true,
        order: [["createdAt","desc"]]
    }).then((results)=> {
        res.render("notice",{data:req.session,notices:results});
    }).catch(err => {
        console.log(err)
        res.redirect("/")
    })
}
