const mongoose = require ('mongoose');
const Joi = require('joi');

const artistSchema = new mongoose.Schema({
    nombre:{type:String,required: true },
    imagen:{type:String,required: true },
    canciones:{type:[String], default: []},
    titulo_album:{type:String,required: true },
});

const validate = (artist) =>{
    const schema = Joi.object({
        nombre: Joi.string().required(),
        imagen: Joi.string().required(),
        canciones: Joi.string().required(),
        titulo_album: Joi.string().required(),
    })
    return schema.validate(artist)
}

const Artist = mongoose.model("artist", artistSchema);

module.exports = {Artist,validate};