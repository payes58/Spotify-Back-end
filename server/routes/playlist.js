const router = require("express").Router();
const {Playlist, validate} = require("../models/playlist");
const {Song} = require("../models/song");
const {User} = require("../models/user");
const auth = require ("../middleware/auth");
const validObjectId = require("../middleware/validObjetId");
const Joi = require('joi');

//crear playlist 
router.post("/", auth, async(req,res) =>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});

    const user = await User.findById(req.user._id);
    const playlist = await Playlist({...req.body, user: user._id}).save();
    user.playlist.push(playlist._id);
    await user.save();

    res.status(201).send({data:playlist})
})

//editar playlist por id

router.put("/edit/:id",[validObjectId, auth], async(req, res) =>{
    const schema = Joi.object({
        name: Joi.string().required(),
        desc: Joi.string().allow(""),
        img: Joi.string().allow(""),
    });
    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send({massage: error.details[0]. message});

    const playlist = await Playlist.findById(req.params.id);
    if(!playlist) return res.status(404).send({message:"La playlist no fue encontrada"});

    const user = await User.findById(req.user._id);
    if(!user._id.equals(playlist.user))
        return res.status(403).send({message: "Este usuario no tiene acceso a editar"});

        playlist.name = req.body.name;
        playlist.desc = req.body.desc;
        playlist.img = req.body.img;
        await playlist.save();

        res.status(200). send({message: "Subida correctamente"});
})

//añadir cancion

router.put("/add-song", auth, async (req, res) =>{
    const schema = Joi.object({
        playlistId: Joi.string().required(),
        songId: Joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send({message: error.detail[0].message});

    const user = await User.findById(req.user._id);
    const playlist = await Playlist.findById(req.params.playlistId);

    if(!user._id.equals(playlist.user))
        return res.status(403).send({message: "Este usuario no tiene acceso para añadir"});

        if(playlist.songs.indexOf(req.body.songId) === -1){
            playlist.songs.push(req.body.songId)
        };

        await playlist.save();
        res.status(200).send({data: playlist, message:"Añadida a la playlist"})
})

//quitar cancion de la playlist
router.put("/remove-song", auth, async(req, res) =>{
    const schema = Joi.object({
        playlistId: Joi.string().required(),
        songId: Joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send({message: error.detail[0].message});

    const user = await User.findById(req.user._id);
    const playlist = await Playlist.findById(req.params.playlistId);

    if(!user._id.equals(playlist.user))
        return res.status(403).send({message: "Este usuario no tiene acceso para eliminar"});

    const index = playlist.songs.indexOf(req.body.songId);
    playlist.songs.splice(index, 1);
    await playlist.save();
    res.status(200).send({data: playlist, message:"Se ha eliminado de la playlist"});
})

//quitar playlist de favorita
router.get("/favorite", auth, async(req, res) =>{
    const user = await User.findById(req.user._id);
    const playlist = await Playlist.find({_id: user.playlist});
    res.status(200).send({data:playlist});
});

//random playlist ??
router.get("/random", auth, async(req, res)=>{
    const playlist = await Playlist.aggregate([{$sample: {size:10}}]);
    res.status(200).send({data:playlist});
});

//playlist por id y cancion
router.get("/:id", [Joi.validObjectId, auth], async(req, res) =>{
    const playlist = await Playlist.findById(req.params.id);
    if(!playlist) return res.status(404).send("not found");

    const songs = await Song.find({_id: playlist.songs});
    res.status(200).send({data: {playlist, songs}});
})

//todas las playlist
router.get("/", auth, async(req,res)=>{
    const playlist = await Playlist.find();
    res.status(200).send({data:playlist});
})

//borrar playlist por id
router.delete("/:id",[validObjectId, auth], async(req, res)=>{
    const user = await User.findById(req.user._id);
    const playlist = await Playlist.findById(req.params.id)

    if(!user._id.equals(playlist.user))
        return res.status(403).send({message: "Este usuario no tiene acceso para borrar"});

        const index = user.playlist.indexOf(req.params.id);
        user.playlist.splice(index, 1);
        await user.save();
        await playlist.remove();
        res.status(200).send({message: "Borrado de libreria"})
})
module.exports = router;