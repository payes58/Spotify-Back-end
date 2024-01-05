const mongoose = require('mongoose');
const Joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

const premiumSchema = new mongoose.Schema({
    fecha_renovacion:{type:String,required: true },
    user:{type: ObjectId, ref:"user",required:true},
    num_tarjeta:{type:String,required: true },
    mes_final:{type:String,required: true },
    año_final:{type:String,required: true },
    codigo_seguridad:{type:String,required: true },
    username_paypal:{type:String,required: true },
});

const validate = (premium) =>{
    const schema = Joi.object({
        fecha_renovacion: Joi.string().required(),
        user: Joi.string().required(),
        num_tarjeta: Joi.string().required(),
        mes_final: Joi.string().required(),
        año_final: Joi.string().required(),
        codigo_seguridad: Joi.string().required(),
        username_paypal: Joi.string().required(),
    })
    return schema.validate(premium)
}

const Premium = mongoose.model("premium", premiumSchema);

module.exports = {Premium,validate};