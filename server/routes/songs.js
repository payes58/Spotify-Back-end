const router = require("express").Router();
const {User} = require ("../models/user");
const {Song, validate} = require("../models/song");
const auth = require("../middleware/auth");
const admin = require ("../middleware/admin");
const validObjectId = require("../middleware/validObjetId");

// Crear cancion
router.post("/",admin ,async (req, res) =>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send({message: "prueba"});

    const song= await Song(req.body).save();
    res.status(201).send({data:song, message: "Cancion creada con exito"});
})

//todas las canciones
router.get("/", async(req, res) => {
    const songs = await Song.find();
    res.status(200).send({data:songs});
});

//actualizar cancion
router.put("/:id",[validObjectId, admin], async(req, res) =>{
    const song= await Song.findByIdAndUpdate(req.params.id, req.body, {new:true});
    res.status(200).send({data:song, message:"Cancion actualizada correctamente"});
});

//eliminar cancion
router.delete("/:id",[validObjectId, admin], async(req, res) =>{
    await Song.findByIdAndDelete(req.params.id);
    res.status(200).send({message: "Cancion borrada correctamente"});
});

//Canciones favoritas
router.put("/like/:id", [validObjectId,auth], async (req, res) =>{
    let resMessage="";
    const song = await Song.findById(req.params.id);
    if(!song) return res.status(400).send({message:"La cancion no existe"});

    const user = await User.findById(req.user._id);
    const index = user.likedSongs.indexOf(song._id);
    if(index == -1){
        user.likedSongs.push(song._id);
        resMessage= "Añadido a Favoritos"
    }else{
        user.likedSongs.splice(index,1);
        resMessage = "Removido de Favoritos";
    }
    await user.save();
    res.status(200).send({message: resMessage});
})

//todas las canciones favoritas
router.get("/like", auth, async(req, res) =>{
    const user = await User.findById(req.user._id);
    const songs = await Song.find({_id: user.likedSongs});
    res.status(200).send({data: songs});
});

module.exports = router;