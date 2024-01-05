const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const artistSchema = new mongoose.Schema({
    nombre:{type:String,required: true },
    password:{type:String,required: true },
    email:{type:String,required: true },
    imagen:{type:String,required: true },
    canciones:{type:[String], default: []},
    album:{type:[String], default: []},
    titulo_album:{type:String,required: true },
    Admin:{type:Boolean,  default: false},
});

artistSchema.methods.generateAuthToken = function (){
    const token = jwt.sign(
        { _id: this._id, nombre: this.nombre, isAdmin: this.isAdmin},
        process.env.JWTPRIVATEKEY,
        {expiresIn:"7d"}
    )
    return token;
}

const validate = (artist) =>{
    const schema = Joi.object({
        nombre: Joi.string().required(),
        password: passwordComplexity().required(),
        email: Joi.string().email().required(),
        imagen: Joi.string().required(),
        canciones: Joi.string().required(),
        titulo_album: Joi.string().required(),
    })
    return schema.validate(artist)
}

const Artist = mongoose.model("artist", artistSchema);

module.exports = {Artist,validate};