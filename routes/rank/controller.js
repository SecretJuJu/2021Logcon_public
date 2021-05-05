const { Member } = require('../../models')
const moment = require('moment');


exports.ranking = (req,res) => {
    var t1 = moment('2021-01-16 09:00');
    var t2 = moment();
    if(moment.duration(t2.diff(t1)).asMinutes() < 0 && req.session.isAdmin!=true){
        res.send('<script>alert("순위는 대회 당일 오전 9시에 공개됩니다!");location.href="/";</script>')
    }else{
        const {filter} = req.query
        let school_level = ""
        if(filter ==="middle") { 
            school_level = "middle"
        } else if (filter === "high") {
            school_level = "high"
        }else {
            res.redirect("/rank?filter=middle")
            return;
        }



        Member.findAll({
            attributes: ['pk','id','score','profile_comment','solve'],
                where : {
                school_level : school_level
            },
            raw : true,
            order: [["score","desc"]]
        }).then(result => {
            res.render("rank",{data:req.session,rank:result})
        }).catch (err=>{
            res.redirect("/")
        })
    }
}