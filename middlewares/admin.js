const adminMiddleware = (req, res, next) => {
    
    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            if(req.session.pk && req.session.isAdmin){
                resolve()
            }else {
                reject()
            }
        }
    )

    // if it has failed to verify, it will return an error message
    const onError = () => { 
        res.status(404).render('404',{data:req.session});
    }

    // process the promise
    p.then(()=>{
        next()
    }).catch(()=>{
        onError()
    })
}

module.exports = adminMiddleware