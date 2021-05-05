const loginMiddleware = (req, res, next) => {
    
    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            if(req.session.pk){
                resolve()
            }else {
                reject()
            }
        }
    )

    // if it has failed to verify, it will return an error message
    const onError = () => { 
        res.redirect("/member/login")
    }

    // process the promise
    p.then(()=>{
        next()
    }).catch(()=>{
        onError()
    })
}

module.exports = loginMiddleware