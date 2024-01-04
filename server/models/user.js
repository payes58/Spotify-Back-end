const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");


    const userSchema = new mongoose.Schema({
        name:{type:String,required: true },
        password:{type:String,required: true },
        email:{type:String,required: true },
        fecha_nacimiento:{type:String,required: true },
        pais:{type:String,required: true },
        codigo_postal:{type:Number,required: true },
        sexo:{type:String,required: true },
        canciones_favoritas:{type:[String], default: []},
        playlist:{type:[String], default: []},
        Admin:{type:Boolean,  default: false},
    })

    userSchema.methods.generateAuthToken = function (){
        const token = jwt.sign(
            { _id: this._id, name: this.name, isAdmin: this.isAdmin},
            process.env.JWTPRIVATEKEY,
            {expiresIn:"7d"}
        )
        return token;
    }

    const validate = (user) => {
        const schema = Joi.object({
            name: Joi.string().min(5).max(12).required(),
            password: passwordComplexity().required(),
            email: Joi.string().email().required(),
            fecha_nacimiento: Joi.string().required(),
            pais: Joi.string(). required(),
            codigo_postal: Joi.string(). required(),
            sexo: Joi.string().valid("Hombre", "Mujer", "Prefiero no decirlo").required()
        });
        return schema.validate(user)
    }

    const User = mongoose.model("user", userSchema);

    module.exports = {User,validate};