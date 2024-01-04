const mongoose = require('mongoose');
const Joi = require("joi");

const songSchema = new mongoose.Schema({
    titulo_cancion:{type:String,required: true },
    numero_reproducciones:{type:String,required: true },
    duracion:{type:Number,required: true },
    autor:{type:String,required: true },
    imagen:{type:String,required: true },
});

const validate =(song)=> {
    const schema = Joi.object({
        titulo_cancion: Joi.string.required(),
        numero_reproducciones: Joi.string.required(),
        duracion: Joi.Number.required(),
        autor: Joi.string.required(),
        imagen: Joi.string.required(),
    })
    return schema.validate(song);
}

const Song = mongoose.model("song", songSchema);

module.exports = {Song, validate};