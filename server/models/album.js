const mongoose = require ('mongoose');
const Joi = require('joi');

const ObjectId = mongoose.Schema.Types.ObjectId;

const albumSchema = new mongoose.Schema({
    titulo_album:{type:String,required: true },
    art:{type: ObjectId, ref:"art",required:true},
    año: {type: String, required: true},
    img:{type: String},
    canciones:{type:Array,default:[] },
});

const validate = (album) => {
    const schema = Joi.object({
        titulo_album: Joi.string().required(),
        art: Joi.string().required(),
        año: Joi.string().required(),
        img: Joi.string().required(),
        canciones: Joi.string().required(),
        numero_canciones: Joi.string().required(),
    })
    return schema.validate(album)
}

const Album = mongoose.model("album", albumSchema);

module.exports = {Album,validate};