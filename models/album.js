const mongoose = require ('mongoose');
const Joi = require('joi');

const albumSchema = new mongoose.Schema({
    titulo_album: {type:String,required: true },
    año: {type: String, required: true},
    img:{type: String},
    nombre:{type:String,required: true },
    titulo_cancion: {type:String,required: true },
    numero_canciones:{type:Array,default:[] },
});

const validate = (album) => {
    const schema = Joi.object({
        titulo_album: Joi.string.required(),
        año: Joi.string.required(),
        img: Joi.string.allow(""),
        nombre: Joi.string.required(),
        titulo_cancion: Joi.string.required(),
        numero_canciones: Joi.array.items(Joi.string()),
    })
    return schema.validate(album)
}

const Album = mongoose.model("album", albumSchema);
module.exports = {Album,validate};