const mongoose = require('mongoose');
const Joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema({
    titulo_playlist:{type:String,required: true },
    user:{type: ObjectId, ref:"user",required:true},
    desc:{type: String},
    numero_canciones:{type:[String], default: []},
    canciones:{type:Array,default:[] },
    fecha_creacion:{type:String,required: true },
    img:{type: String}
});

const validate =(playlist) => {
    const schema = Joi.object({
        titulo_playlist: Joi.string().required(),
        user: Joi.string().required(),
        desc: Joi.string().allow(""),
        numero_canciones: Joi.string().required(),
        canciones:Joi.string().required(),
        fecha_creacion: Joi.string().required(),
        imagen: Joi.string().required(),
    });
    return schema.validate(playlist)
}

const Playlist = mongoose.model("playlist", playlistSchema);

module.exports = {Playlist,validate};