const mongoose = require ('mongose');
const Joi = require('joi');

const artistSchema = new mongoose.Schema({
    nombre:{type:String,required: true },
    img:{type: String},
    titulo_canciones:{type:String,required: true },
    titulo_album:{type:String,required: true },
});

const validate = (artist) =>{
    const schema = Joi.object({
        nombre: Joi.string.required(),
        img: Joi.string.allow(""),
        titulo_cancion: Joi.string.required(),
        titulo_album: Joi.string.required(),
    })
    return schema.validate(artist)
}

const Artist = mongoose.model("artist", artistSchema);

module.exports = {Artist,validate};