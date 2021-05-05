const util = require("util")
const path = require("path")
const multer = require("multer")
const randomstring = require("randomstring")
var crypto = require('crypto')
var fs = require('fs')
const md5File = require('md5-file')
const moment = require('moment')

const Challenge = require("../../models/index").Challenge
const Notice = require("../../models/index").Notice
const Member = require("../../models/index").Member
const { request } = require("express")

const time = moment().format('MMMM Do YYYY, h:mm:ss a');


var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../../public/chall_images/`));
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
      return callback(message, null);
    }

    var filename = randomstring.generate(); // tmp name
    callback(null, filename);
  }
});

const uploadFiles = multer({ storage: storage, md5:"md5"}).array("images", 10);
const FileUploader = util.promisify(uploadFiles);


exports.adminPage = (req,res) =>{
    if (req.session.isAdmin){
        res.render('admin')
    } else {
        res.status(404).render('404',{data:req.session})
    }    
}

exports.CNotice = (req,res) => {
    Notice.create({
        title : req.body.title,
        content : req.body.content
    }).then(()=>{
        console.log(time + ": 공지 추가 완료 : " + req.body.title)
        res.send("<script> alert('공지 추가 완료');history.back() </script>")
    }).catch( (error) => {
        console.log(time + ": 공지 추가 실패 : " + req.body.title + " !!error : " + error)
        res.send("<script> alert('공지 추가 실패');history.back() </script>")
    })
}

exports.CChall = (req,res) => {
    
    new Promise(async function (resolve, reject) {
        try {
            await FileUploader(req, res);
            new Promise((resolve, reject) => {
                if (req.files.length === 0) {
                    resolve();
                }
                req.files.forEach((element,index,array) => {
                    md5File(element.path).then((hash) => {
                        req.files[index].fileHash = hash
                        fs.rename( element.path,element.destination+hash,()=>{})
                        if (index === array.length -1) resolve();
                    }).catch(err=>{
                        reject(err)
                    })
                });
            }).then(()=>{
                resolve()
            }).catch( err=>{
                console.log(err)
                reject("파일해시를 구하던중 에러")
            })
        } catch (error) {
            if (error.code === "LIMIT_UNEXPECTED_FILE") {
                reject("Too many files to upload.")
            }
            reject(`Error when trying upload many files: ${error}`)
        }
    }).then(()=>{
        const {
            title,contents,score,answer,file_link,category,
        } = req.body
        
        // concat file hashs
        var image_names = ""
        new Promise((resolve, reject) => {
            if(req.files.length === 0) resolve()
            req.files.forEach((file,index,array)=>{
                image_names +=file.fileHash+" "
                if (index === array.length -1) resolve()
            })
        }).then(()=>{
            Challenge.create({
                title,contents,score,answer,file_link,category,
                image_name:image_names
            }).then(()=>{
                console.log(time + ": 문제 추가 완료 title: " + req.body.title)
                res.send("<script>alert('success');history.back()</script>")
            }).catch(err=>{
                console.log(time + ": error")
                res.send("error")
            })
        })
    }).catch((msg)=>{
        console.log(time + ": error occured! msg : " + msg)
        res.send(`<script>alert("${msg}");history.back()</script>`)
    })


}
exports.DMemberList = (req,res) => {
    Member.findAll()
    .then((results) => {
        res.render('DMemberList', {results:results})
    }).catch((err) => {
        console.log(time + ": DMemberList 에러! err: "+ err)
        res.send("<script>alert('error');history.back()</script>")
    })
}
exports.DMember = (req,res) => {
    var pk = req.params.pk
    var id
    Member.findAll({
        where: {
            pk:pk
        }
    }).then(results => {
        id = results[0]['id']
        Member.destroy({
            where:{
                pk:pk
            }
        }).then((results) => {
            console.log(time + ": 유저 삭제 성공! id: "+id)
            res.send("<script>alert('success');window.location.href = '/admin/DMember' </script>")
        }).catch((err) => {
            console.log(time + ": 유저 삭제 에러! err: "+err)
            res.send("<script>alert('error');history.back()</script>")
        })
    })
}
exports.DChallList = (req,res) => {
    Challenge.findAll()
    .then((results) => {
        res.render('DChallList', {results:results})
    }).catch((err) => {
        console.log(time + ": DChallList 에러! err: "+ err)
        res.send("<script>alert('error');history.back()</script>")
    })

}
exports.DChall = (req, res) => {

    var pk = req.params.pk
    var title
    Challenge.findAll({
        where: {
            pk:pk
        }
    }).then(results => {
        title = results[0]['title']
        Challenge.destroy({
            where:{
                pk:pk
            }
        }).then((results) => {
            console.log(time + ": 문제 삭제 성공! title: "+title)
            res.send("<script>alert('success');window.location.href = '/admin/DChall' </script>")
        }).catch((err) => {
            console.log(time + ": 문제 삭제 에러! err: "+err)
            res.send("<script>alert('error');history.back()</script>")
        })
    })
    
}
exports.UChallList = (req,res) => {
    
    Challenge.findAll()
    .then((results) => {
        res.render('UChallList', {results:results})
    }).catch((err) => {
        console.log(time + ": UChallList 에러! err: "+ err)
        res.send("<script>alert('error');history.back()</script>")
    })

}
exports.UChall = (req, res) => {
    var pk = req.params.pk

    Challenge.findAll({
        where: {
            pk : pk
        }
    }).then((results) => {
        res.render("UChall", {
            pk: results[0]['pk'],
            title: results[0]['title'],
            contents: results[0]['contents'],
            score: results[0]['score'],
            answer: results[0]['answer'],
            file: results[0]['file_link'],
            radio: results[0]['category']
        })
    }).catch((err) => {
        console.log(time + ": 문제 수정창 접근 에러! err: "+ err)
    })

}
exports.UChallAct = (req, res) => {

    new Promise(async function (resolve, reject) {
        try {
            await FileUploader(req, res);
            new Promise((resolve, reject) => {
                if (req.files.length === 0) {
                    resolve();
                }
                req.files.forEach((element,index,array) => {
                    md5File(element.path).then((hash) => {
                        req.files[index].fileHash = hash
                        fs.rename( element.path,element.destination+hash,()=>{})
                        if (index === array.length -1) resolve();
                    }).catch(err=>{
                        reject(err)
                    })
                });
            }).then(()=>{
                resolve()
            }).catch( err=>{
                console.log(err)
                reject("파일해시를 구하던중 에러")
            })
        } catch (error) {
            if (error.code === "LIMIT_UNEXPECTED_FILE") {
                reject("Too many files to upload.")
            }
            reject(`Error when trying upload many files: ${error}`)
        }
    }).then(()=>{
        const {
            pk,title,contents,score,answer,file_link,category,
        } = req.body
        
        // concat file hashs
        var image_names = ""
        new Promise((resolve, reject) => {
            if(req.files.length === 0) resolve()
            req.files.forEach((file,index,array)=>{
                image_names +=file.fileHash+" "
                if (index === array.length -1) resolve()
            })
        }).then(()=>{
            Challenge.update({
                title: title,
                contents: contents,
                score: score,
                answer: answer,
                file_link: file_link,
                category:category,
                image_name: image_names
            },
            {
                where:{
                    pk: pk
                }
            }).then(()=>{
                console.log(time + ": 문제 수정 완료 : " + req.body.title)
                res.send("<script>alert('success');history.back()</script>")
            }).catch(err=>{
                console.log(time + ": 문제 수정 에러! err: "+err)
                res.send("error")
            })
        })
    }).catch((msg)=>{
        console.log(time + ": error occured! msg : " + msg)
        res.send(`<script>alert("${msg}");history.back()</script>`)
    })

}
exports.DNoticeList = (req,res) => {
    Notice.findAll()
    .then((results) => {
        res.render('DNoticeList', {results:results})
    }).catch((err) => {
        console.log(time + ": DNoticeList 에러! err: "+ err)
        res.send("<script>alert('error');history.back()</script>")
    })
}
exports.DNotice = (req,res) => {
    var pk = req.params.pk
    var title
    Notice.findAll({
        where: {
            pk:pk
        }
    }).then(results => {
        title = results[0]['title']
        Notice.destroy({
            where:{
                pk:pk
            }
        }).then((results) => {
            console.log(time + ": 공지 삭제 성공! title: "+title)
            res.send("<script>alert('success');window.location.href = '/admin/DNotice' </script>")
        }).catch((err) => {
            console.log(time + ": 공지 삭제 에러! err: "+err)
            res.send("<script>alert('error');history.back()</script>")
        })
    })
}