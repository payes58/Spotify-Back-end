const router = require("express").Router();
const {Album, validate} = require ("../models/album");
const {Song} = require("../models/song");
const {Artist} = require("../models/artist");
const authArt = require("../middleware/authArtist");
const validObjectId = require ("../middleware/validObjetId");
const Joi = require ('joi');

//crear album
//funciona todo bien que yo sepa
router.post("/", authArt, async (req, res) =>{
    const {error} = validate(res.body);
    if(error) return res.status(400).send({message: error.details[0].message})
    const artist = await Artist.findById(req.artist._id);
    const album = await Album({...req.body,artist:artist._id}).save();
    artist.album.push(album._id);
    await artist.save();

    res.status(201).send({message: "Album creado correctamente"});
})

//editar por id
//edita lo que uno quiera
router.put("/edit/:id", [validObjectId, authArt], async(req, res) =>{
    const schema = Joi.object({
        titulo_album: Joi.string().required(),
        año: Joi.string().allow(""),
        canciones: Joi.string().allow(""),
    });
    const {error} = schema.validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});

    const album = await Album.findById(req.params.id);
    if(!album) return res.status(404).send({message :"Playlist no encontrada"});

    const user = await User.findById(req.user._id);
    if(!user._id.equals(album.user))
    return res.status(403).send({message:"El usuario no tiene acceso a editar"});

    album.titulo_album = req.body.titulo_album;
    album.año = req.body.año;
    album.canciones = req.body.canciones;
    await album.save();

    res.status(200).send({message:"Editado exitosamente"});
})
//añadir cancion al album
//no puedo añadir cancion, me da error en el "indexOf" trate de solucionarlo pero el tiempo me comia
router.put("/add-song", authArt, async(req,res) =>{
    const schema = Joi.object({
        albumId: Joi.string().required(),
        songId: Joi.string().required(),
    });
    const{error} = schema.validate(req.body);
    if(error) return res.status(400).send({message: error.details[0].message});

    const user = await User.findById(req.user._id);
    const album = await Album.findById(req.body.albumId);
    if(!user._id.equals(album.user))
        return res.status(403).send({message:"El usuario no tiene acceso para añadir"});

    if(album.songs.indexOf(req.body.songId) ===-1){
        album.songs.push(req.body.songId)
    };

    await album.save();
    res.status(200).send({data:album, message:"Añadido al album"});
});
//borrar canciones de album
//mismo error que borrar canciones de album, indexOf
router.put("/remove-song", authArt, async(req,res) =>{
    const schema = Joi.object({
        albumId: Joi.string().required(),
        songId: Joi.string().required(),
    });
    const{error} = schema.validate(req.body);
    if(error) return res.status(400).send({message: error.details[0].message});

    const user = await User.findById(req.user._id);
    const album = await Album.findById(req.body.albumId);
    if(!user._id.equals(album.user))
        return res.status(403).send({message:"El usuario no tiene acceso para eliminar"});

    const index = album.songs.indexOf(req.body.songId);
    album.songs.splice(index,1);
    await album.save();
    res.status(200).send({data: album,message:"Removido del album"})
})

//albums favoritos
//error en objectId 
router.get("/favourite" , authArt, async(req, res) =>{
    const user = await User.findById(req.user._id);
    const album = await Album.find({_id: user.album});
    res.status(200).send({data:album});
});

//album por id
//funciona bien
router.get("/:id" , [validObjectId, authArt], async (req,res) =>{
    const album = await Album.findById(req.params.id);
    if(!album) return res.status(404).send("no encontrado");

    const songs = await Song.find({_id:album.song});
    res.status(200).send({data:{album,songs}});
})

//todas las album
//funciona bien
router.get("/", authArt, async(req,res) =>{
    const album = await Album.find();
    res.status(200).send({data:album});
})

//eliminar por id
//funciona bien si no mal recuerdo
router.delete("/:id",[validObjectId, authArt], async(req, res ) =>{
    const user = await User.findById(req.user._id);
    const album = await Album.findByIdAndDelete(req.params.id);

    if(!user._id.equals(album.user))
        return res.status(403).send({message:"El usuario no tiene acceso para eliminar"});

    await user.save();
    res.status(200).send({message:"Removido de la libreria"});
});

module.exports = router;