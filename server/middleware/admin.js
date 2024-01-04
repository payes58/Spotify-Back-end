const jwt = require ("jsonwebtoken");

module.exports = (req, res, next) =>{
    const token = req.header("x-auth-token");
    if(!token)
        return res.status(400).send({ messagge:"acceso denegado, no hay token"})

        jwt.verify(token, process.env.JWTPRIVATEKEY,(error, validToken) => {
            if(error){
                return res.status(400).send({messagge:"Token no valido"})
            }else{
                if(!validToken.isAdmin)
                    return res.status(403).send({Message:"No tienes acceso a este contenido"});
                req.user = validToken;
                next();
            }
        }) 
}