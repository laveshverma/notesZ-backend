var jwt = require("jsonwebtoken");

const jwtSecret = `${process.env.JWT_SECRET_KEY}`;

const fetchuser = (req,res,next) => {
// get the user from the jwt token and add id to request object
const token = req.header('auth-token');
if(!token){
    res.status(401).send({error: "please authenticate using a valid token"});
}
try {
    const data = jwt.verify(token , jwtSecret);
req.user = data.user;
next();
} catch (error) {
    console.error(error.message);
    res.status(500).send("Error: check console for details"); 
}


} 


module.exports = fetchuser