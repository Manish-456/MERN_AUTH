const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require('../config/config');
const Auth = async(req, res, next) => {
    try {
        // access authoriza header to validate request
      const token = req.headers.authorization.split(" ")[1];
      if(!token) return res.status(409).json({error : "Please provide valid token"});
jwt.verify(token, JWT_SECRET, function(err, user){
    if(err) return res.status(400).json({error : "Invalid token"})
    req.user = user;
    next();
})        
    } catch (error) {
        return res.status(401).json({error : "Authentication Failed"})
        
    }
}

const localVariables = (req, res, next) => {
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next()
}

module.exports = {Auth, localVariables}