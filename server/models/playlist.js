const mongoose = require('mongoose');
const Joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema({
    titulo_playlist:{type:String,required: true },
    user:{type: ObjectId, ref:"user",required:true},
    desc:{type: String},
    numero_canciones:{type:Array,default:[] },
    fecha_creacion:{type:String,required: true },
    Eliminada:{type:Boolean,default: false },
    fecha_eliminacion:{type:String,required: true },
    es_compartida:{type:String,required: true },
    img:{type: String}
});

const validate =(playlist) => {
    const schema = Joi.object({
        titulo_playlist: Joi.string.required(),
        user: Joi.string.required(),
        desc: Joi.string.allow(""),
        numero_canciones: Joi.array.items(Joi.string()),
        fecha_creacion: Joi.string.required(),
        Eliminada: Joi.string.required(),
        fecha_eliminacion: Joi.string.required(),
        es_compartida: Joi.string.required(),
        img: Joi.string.allow(""),
    });
    return schema.validate(playlist)
}

const Playlist = mongoose.model("playlist", playlistSchema);

module.exports = {Playlist,validate};