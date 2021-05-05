const adminMiddleware = (req, res, next) => {
    
    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            if(req.session.pk && req.session.authenticated){
                resolve()
            }else {
                reject()
            }
        }
    )

    // if it has failed to verify, it will return an error message
    const onError = () => { 
        res.redirect('/member/email')
    }

    // process the promise
    p.then(()=>{
        next()
    }).catch(()=>{
        onError()
    })
}

module.exports = adminMiddleware