function isAdmin(req, res, next){
  const {role} = req.user
  if(role != "admin"){
    res.status(401).json({error: "You are not admin"})
    return
  }
  next()
}

module.exports = isAdmin