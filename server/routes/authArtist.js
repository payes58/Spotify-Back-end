const router = require("express").Router();
const{Artist} = require("../models/artist");
const bcrypt = require("bcrypt");

router.post("/", async(req, res) =>{
    const artist = await Artist.findOne({email: req.body.email});
    if(!artist)
        return res.status(400).send({message: "email o contraseña no validos"});

        const validPassword = await bcrypt.compare(req.body.password, artist.password);
        if (!validPassword)
        return res.status(400).send({message:"email o contraseña no validos"});

        const token = artist.generateAuthToken();
        res.status(200).send({data:token,message:"Iniciando Sesión, espere..."})
})

module.exports = router;