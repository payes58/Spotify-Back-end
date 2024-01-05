const router = require("express").Router();
const {Playlist, validate} = require ("../models/playlist");
const {Song} = require("../models/song");
const {User} = require("../models/user");
const auth = require("../middleware/auth");
const validObjectId = require ("../middleware/validObjetId");
const Joi = require ('joi');
const admin = require("../middleware/admin");

//crear playlist

router.post("/", auth, async (req, res) =>{
    const {error} = validate(res.body);
    if(error) return res.status(400).send({message: error.details[0].message})
    const user = await User.findById(req.user._id);
    const playlist = await Playlist({...req.body,user:user._id}).save();
    user.playlist.push(playlist._id);
    await user.save();

    res.status(201).send({message: "Playlist creada correctamente"});
})

//editar por id

router.put("/edit/:id", [validObjectId, auth], async(req, res) =>{
    const schema = Joi.object({
        titulo_playlist: Joi.string().required(),
        desc: Joi.string().allow(""),
        img: Joi.string().allow(""),
    });
    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});

    const playlist = await Playlist.findById(req.params.id);
    if(!playlist) return res.status(404).send({message :"Playlist no encontrada"});

    const user = await User.findById(req.user._id);
    if(!user._id.equals(playlist.user))
    return res.status(403).send({message:"El usuario no tiene acceso a editar"});

    playlist.titulo_playlist = req.body.titulo_playlist;
    playlist.desc = req.body.desc;
    playlist.img = req.body.img;
    await playlist.save();

    res.status(200).send({message:"Editado exitosamente"});
})

//añadir cancion a la playlist

router.put("/add-song", auth, async(req,res) =>{
    const schema = Joi.object({
        playlistId: Joi.string().required(),
        songId: Joi.string().required(),
    });
    const{error} = schema.validate(req.body);
    if(error) return res.status(400).send({message: error.details[0].message});

    const user = await User.findById(req.user._id);
    const playlist = await Playlist.findById(req.body.playlistId);
    if(!user._id.equals(playlist.user))
        return res.status(403).send({message:"El usuario no tiene acceso para añadir"});

    if(playlist.songs.indexOf(req.body.songId) ===-1){
        playlist.songs.push(req.body.songId)
    };

    await playlist.save();
    res.status(200).send({data:playlist, message:"Añadido a la playlist"});
});

//quitar cancion de playlist

router.put("/remove-song", auth, async(req,res) =>{
    const schema = Joi.object({
        playlistId: Joi.string().required(),
        songId: Joi.string().required(),
    });
    const{error} = schema.validate(req.body);
    if(error) return res.status(400).send({message: error.details[0].message});

    const user = await User.findById(req.user._id);
    const playlist = await Playlist.findById(req.body.playlistId);
    if(!user._id.equals(playlist.user))
        return res.status(403).send({message:"El usuario no tiene acceso para eliminar"});

    const index = playlist.songs.indexOf(req.body.songId);
    playlist.songs.splice(index,1);
    await playlist.save();
    res.status(200).send({data: playlist,message:"Removido de la playlist"})
})

//playlist favoritas

router.get("/favourite" , auth, async(req, res) =>{
    const user = await User.findById(req.user._id);
    const playlist = await Playlist.find({_id: user.playlist});
    res.status(200).send({data:playlist});
});

//playlist por id

router.get("/:id" , [validObjectId, auth], async (req,res) =>{
    const playlist = await Playlist.findById(req.params.id);
    if(!playlist) return res.status(404).send("no encontrado");

    const songs = await Song.find({_id:playlist.song});
    res.status(200).send({data:{playlist,songs}});
})

//todas las playlist

router.get("/", auth, async(req,res) =>{
    const playlist = await Playlist.find();
    res.status(200).send({data:playlist});
})

//eliminar por id

router.delete("/:id",[validObjectId, admin], async(req, res ) =>{
    const user = await User.findById(req.user._id);
    const playlist = await Playlist.findByIdAndDelete(req.params.id);

    if(!user._id.equals(playlist.user))
        return res.status(403).send({message:"El usuario no tiene acceso para eliminar"});

    await user.save();
    res.status(200).send({message:"Removido de la libreria"});
});

module.exports = router;