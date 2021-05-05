exports.main = (req,res) => {
    res.render("index",{data:req.session})
}