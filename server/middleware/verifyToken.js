const jwt = require('jsonwebtoken')

function verifyToken(req, res, next){
  const token = req.headers.authorization?.split(' ')[1]
  if(!token){
    res.status(401).json({error: "Neplatný token"})
    return
  }
  try{
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decode
    next()
  } catch(err){
    res.status(401).json({error: "Neplatný token"})
  }
}


module.exports = verifyToken