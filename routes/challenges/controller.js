const Challenge = require("../../models/index").Challenge
const Solved = require("../../models/index").Solved
const Member = require("../../models/index").Member
const moment = require('moment')

const time = moment().format('MMMM Do YYYY, h:mm:ss a');

exports.challenges = (req,res) =>{
    var t1 = moment('2021-01-16 09:00');
    var t2 = moment();
    if(moment.duration(t2.diff(t1)).asMinutes() < 0 && req.session.isAdmin!=true){
        res.send('<script>alert("문제는 대회 당일 오전 9시에 공개됩니다!");location.href="/";</script>')
    }else{
        Challenge.findAll({
            raw: true,
            attributes: ['pk', 'title','score','category']
        }).then(results=>{
            Solved.findAll({
                raw:true,
                attributes: ['chall_pk'],
                where:{
                    mem_pk:req.session.pk
                }
            }).then((solveds)=>{
                res.render('challenges',{
                    data:req.session,
                    challenges:results,
                    solveds:solveds
                })
            }).catch((err)=>{
                res.redirect('/')
            })
        }).catch((err)=>{
            res.redirect('/')
        })
    }
}

exports.show_detail = (req,res) => {
    
    Challenge.findOne({
        where : {
            pk : req.params.num
        },
        attributes : ['pk','title','contents','score','category','image_name','file_link'],
        raw : true
    }).then(result => {
        if(result){
            res.render('challenge',{data:req.session,challenge:result})
        } else {
            res.send("<script> alert('없는 문제입니다.'); location.href='/challenges'; </script>")
        }
    }).catch(err=>{
        res.redirect("/")
    })

    
}

exports.flag = (req, res) => {
    var pk = req.params.num
    var flag = req.body.answer
    //var answer = flag.substring(8, flag.length-1)
    if(flag.indexOf(" ") != -1) res.send("<script> alert('플래그에 공백문자를 입력할 수 없습니다!'); history.back(); </script>")
    else if(flag.substring(0,8) !== "TeamLog{" || flag.charAt(flag.length-1) !== "}") res.send("<script> alert('플래그 형식을 지켜주세요!'); history.back(); </script>")
    else {
        Solved.findAndCountAll({
            where:{
                chall_pk: pk,
                mem_pk: req.session.pk
            }
        }).then( result => {
            //if(result.count != 1){ 라이트업 제출 후 수정
                Challenge.findOne({
                    where:{
                        pk: pk
                    },
                    attributes: ['answer', 'score']
                }).then(result => {
                    if(flag == result['answer']) {
                        console.log(result['answer']);
                        var chall_score = result['score']
                        Solved.create({
                            chall_pk: pk,
                            mem_pk: req.session.pk
                        }).then(() =>{
                            Member.findOne({
                                where:{
                                    pk: req.session.pk
                                }
                            }).then(result => {
                                var score = result['scores']// 라이트업 제출 후 수정
                                var solve = result['solves']// 라이트업 제출 후 수정
                                Member.update({
                                    score: score, //라이트업 제출 후 수정
                                    solve: solve //라이트업 제출 후 수정
                                },
                                {
                                    where:{
                                        pk:req.session.pk
                                    }
                                }).then(() => {
                                    console.log(time + ": pk" + pk+" 문제 정답, 정답자pk : " + req.session.pk + ", 제출한 플래그 : " + flag)
                                    res.send("<script> alert('정답입니다!!'); location.href='/challenges'; </script>")
                                }).catch(err => {
                                    console.log(time+": 정답자 처리 에러 발생 : " + err)
                                    res.send("<script> alert('정답자 처리 에러 발생!'); history.back(); </script>")
                                })
                            })
                        }).catch(err => {
                            console.log(time+": 플래그 정답자 입력 에러 발생 : " + err)
                            res.send("<script> alert('정답자 입력 에러 발생!'); history.back(); </script>")
                        })
                    }
                    else{
                        console.log(time + ": pk" + pk+" 문제 오답, 오답자pk : " + req.session.pk + ", 제출한 플래그 : " + flag)
                        res.send("<script> alert('오답입니다!!'); location.href='/challenges/detail/" + pk + "'; </script>")
                    }
                }).catch(err => {
                    console.log(time+": 플래그 정답 조회 에러 발생 : " + err)
                    res.send("<script> alert('에러 발생!'); history.back(); </script>")
                })
            //} 라이트업 제출 후 수정
            /*else if(flag == answer){
                res.send("<script> alert('정답입니다!'); history.back(); </script>")
            }else{
                console.log(answer);
                res.send("<script> alert('오답입니다!!'); history.back(); </script>")
            }*/
        }).catch( err =>{
            console.log(time+": 이미 푼 문제 여부 조회 오류 : " + err)
            res.send("<script> alert('이미 푼 문제 여부 조회 에러 발생!'); history.back(); </script>")
        })
    }

}