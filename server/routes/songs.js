const router = require("express").Router();
const {User} = require ("../models/user");
const {Song, validate} = require("../models/song");
const auth = require("../middleware/auth");
const admin = require ("../middleware/admin");
const validObjectId = require("../middleware/validObjetId");

// Crear cancion
router.post("/", admin , async (req, res) =>{
    const {error} = validate(req.body);
    if(error) return res.status(400). send({message: error.details[0].message});

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

