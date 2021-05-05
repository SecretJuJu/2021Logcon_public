const Member = require("../../models/index").Member
const crypto = require('crypto');
const moment = require('moment');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const mail_info = require('../../config/config.json').mail_info
const { Op } = require('sequelize')

var transporter = nodemailer.createTransport({
    service: mail_info.service,
    host: mail_info.host,
    auth: {
      user: mail_info.user,
      pass: mail_info.pass
    }
});

const send_mail = (mailOptions,callback) => {
    transporter.sendMail(mailOptions, (err, res) => {
        callback(res,err)
    });
}


exports.loginPage = (req,res) => {
    res.render('login',{data:req.session})
}

exports.login = (req,res) => {
    const id = req.body.id
    const passwd = crypto.createHash('sha512').update(req.body.passwd).digest('base64');
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    
    Member.findOne({ 
        where : { 
            id : id,
            passwd : passwd
        },
        raw:true
    }).then(result => {
        if(result !== null) {
            const {pk,id,email,solve,score,authenticated,school_level,isAdmin} = result
            req.session.pk = pk
            req.session.username = id
            req.session.email = email
            req.session.solve = solve
            req.session.score = score
            req.session.authenticated = authenticated
            req.session.school_level = school_level
            req.session.isAdmin = isAdmin
            req.session.save(()=>{
                console.log(time+ ': '+id + ' 로그인 성공 - '+ ip);
                res.redirect("/")
            })
        }else {
            console.log(time+': '+id + ' 로그인 실패 - '+ip);
            res.send("<script>alert('로그인 실패..');location.href='/member/login'</script>")
        }
    }).catch(err => {
        console.log(time+': '+id + ' 로그인 실패 - '+ip);
        res.send("<script>alert('로그인 실패..');location.href='/member/login'</script>")
    })
}

exports.registerPage = (req,res) =>{
    res.render('register',{data:req.session})
}

exports.register = (req,res)=>{
    const {id,email,passwd,confirm_passwd,school_name,school_level} = req.body
    const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    // filter
    if (!((id) && (email) && (passwd) && (confirm_passwd) && (school_name) && (school_level) )){
        res.send("<script> alert(\"입력되지 않은 값이있어요!\"); history.back()</script>")
    } else if (passwd.length<8||passwd.length>20||id.length>20||id.length<5) {
        res.send("<script> alert(\"비밀번호는 8~20자, 아이디는 5~20자로 맞춰주세요!\");history.back();</script>")
    } else if ( !((email) => { return email.match("^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$")})){
        res.send("<script> alert(\"이메일을 확인 해 주세요!\"); history.back()</script>")
    } else if( !(school_level === "middle" || school_level === "high") ){
        res.send("<script> alert(\"중학교와 고등학교중에 선택 해 주세요\"); history.back()</script>")
    } else if ( !(passwd === confirm_passwd) ){
        res.send("<script> alert(\"비밀번호를 확인 해 주세요!\"); history.back()</script>")
    } else if ( id.indexOf(' ') !== -1){
        res.send("<script>alert(\"아이디에는 공백이 들어가면 안돼요!\"); history.back() </script>")
    } else {
        Member.findOne({ 
            where : {
                [Op.or]: [{id: id}, {email: email}]
            }
        }).then((r)=> {
            if(r !== null){
                if(r.dataValues.id === id){
                    res.send("<script>alert(\"중복된 아이디가 있습니다.\"); history.back() </script>")
                    return
                }else if(r.dataValues.email === email){
                    res.send("<script>alert(\"중복된 이메일이 있습니다.\"); history.back() </script>")
                    return 
                }
            }
            
            const auth_key = randomstring.generate();

            Member.create({
                id: id,
                passwd:crypto.createHash('sha512').update(passwd).digest('base64'),
                email:email,
                auth_key:auth_key,
                school_name : school_name,
                school_level : school_level
            }).then((result) => {
                const mailOptions = {
                    from: 'TeamLog',
                    to: email ,
                    subject: 'LOGCON 인증',
                    text: '가입완료를 위해 <'+auth_key+'> 를 입력해주세요'
                };

                send_mail(mailOptions,(res,err) => {
                    if(err){
                        console.log(err)
                    }else{
                        console.log(res,time+"-"+ip)
                    }
                })
                res.send("<script> alert(\"회원가입 성공!\") ; window.location.href=\"/member/login\"</script>")
                return
            }).catch((err)=>{
                console.log(err)
                res.send("<script>alert(\"회원가입에 실패하였습니다. 1\"); history.back() </script>")
                return
            })
        }).catch((err)=>{
            console.log(err)
            res.send("<script>alert(\"회원가입에 실패하였습니다. 2\"); history.back() </script>")
            return
        })
    }

    
}

exports.logout = (req,res)=>{
    req.session.destroy(
        function (err) {
            if (err) {
                return;
            }
            res.send("<script> alert(\"로그아웃\"); window.location.href=\"/\"</script>")
        }
    );
}

exports.emailPage = (req,res) => {
    res.render("email",{data:req.session})
}

exports.emailAuth = (req,res) => {
    const {authcode} = req.body
    const {pk,authenticated} = req.session
    if(!authenticated) {
        Member.update(
            {
                authenticated: true
            },
            {
                where: {
                    pk: pk,
                    auth_key : authcode
                }
        }).then(function(result) {
            if(result[0] !== 0) {
                console.log(result)
                req.session.authenticated = true
                req.session.save()
                res.send("<script> alert('인증되었습니다!');location.href='/'</script>")
                
            }else {
                res.send("<script> alert('인증코드가 틀립니다..');history.back()</script>")
            }
        }).catch(function(err) {
            console.log(err)
            res.send("<script> alert('인증 실패..');history.back()</script>")
        });
    } else {
        res.send("<script> alert('이미 인증되었습니다.');history.back()</script>")
    }
}

exports.resendEmail = (req,res) => {
    const {pk,authenticated} = req.session

    const new_auth_key = randomstring.generate()

    if(!authenticated) {
        let time_gap = new Date()
        time_gap.setSeconds(time_gap.getSeconds() - 30);
        Member.update(
            {
                auth_key: new_auth_key
            },
            {
                where: {
                    pk: pk,
                    updatedAt : {
                        [Op.lt]: time_gap,
                    }
                }
        }).then(function(result) {
            if(result[0] !== 0){

                const mailOptions = {
                    from: 'TeamLog',
                    to: req.session.email ,
                    subject: 'LOGCON 인증',
                    text: '가입완료를 위해 <'+new_auth_key+'> 를 입력해주세요'
                };

                send_mail(mailOptions,(res,err) => {
                    if(err){
                        console.log(err)
                    }else{
                        console.log(res,time+"-"+ip)
                    }
                })

                res.send("<script> alert('이메일이 재전송 되었습니다!');history.back()</script>")
            }else {
                res.send("<script> alert('이메일 재전송은 30초마다 가능합니다.');history.back()</script>")
            }    
        }).catch(function(err) {
            res.send("<script> alert('재전송 실패..');history.back()</script>")
        });
    } else {
        res.send("<script> alert('이미 인증 되었습니다.');location.href='/'</script>")
    }
}

exports.profilePage = (req,res) => {
    const pk = req.params.pk
    if(req.session.pk == pk || req.session.isAdmin){
        Member.findOne({
            where: {
                pk :req.session.pk
            },
            raw:true,
            attributes: ['pk','id','email','solve','score','authenticated','school_level','isAdmin','school_name','profile_comment']
        }).then(result=>{
            res.render('profile',{data:result})
        }).catch(err=>{
            res.redirect('/')
        })
    }else {
        res.send("<script> alert('본인의 프로필만 보거나 수정할 수 있습니다.');history.back()</script>")
    }    
    
}
exports.updatepf = (req,res) =>{
    Member.findOne({
        where: {
            id:req.session.username
        },
        attributes: ['pk', 'id', 'passwd', 'school_level', 'school_name', 'profile_comment']
}).then(result=>{
    res.render('updatepf', {data:result});
})

}
exports.Uprofile = (req,res)=>{
    const id = req.session.username;
    const{passwd, confirm_passwd, school_level, school_name, profile_comment}=req.body;
    if(!((passwd)&&(confirm_passwd)&&(school_level)&&(school_name))){
        res.send("<script> alert(\"입력되지 않은 값이 있어요!\"); history.back()</script>")
    }else if (passwd.length<8||passwd.length>20||id.length>20||id.length<5) {
        res.send("<script> alert(\"패스워드의 길이를 8~20자로 맞춰주세요!\");history.back();</script>")
    }else if(!(passwd===confirm_passwd)){
        res.send(`<script>alert("비밀번호를 다시 확인해주세요!);history.back();</script>`);
    }else{
        Member.update({
            passwd: crypto.createHash('sha512').update(passwd).digest('base64'),                                                
            school_level : school_level,
            school_name : school_name,
            profile_comment : profile_comment                                   
        },
        {
            where : {
                id : id
            }
        }).then(()=>{
            console.log("modify success")
            res.send(`<script>alert("수정 완료!");location.href='/';</script>`);
        }).catch((msg)=>{
            console.log("error")
            console.log(msg)
            res.send(`<script>alert('${msg}');history.back()</script>`)
        })
    }

}