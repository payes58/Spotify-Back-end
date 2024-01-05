const router = require("express").Router();
const{Artist, validate} = require ("../models/artist");
const auth = require ("../middleware/auth");
const validObjectId= require ("../middleware/validObjetId");
const admin = require("../middleware/admin");


//creacion del artista
router.post("/", async(req, res) =>{
    const{error} = validate(req.body);
    if(error)return res.status(400).send({ message: error.details[0].message});

    const artist = await Artist.findOne({nombre: req.body.nombre});
    if(artist)
    return res.status(403).send({message:"Este artista ya existe dentro de la base"})
    await Artist(req.body).save();
    res.status(200).send({message:"Artista creado exitosamente" })
});

//Select All 
router.get("/",admin, async(req,res) =>{
    const artist = await Artist.find().select("-password -__v");
    res.status (200).send({data:artist})
})

//artista por Id
router.get("/:id", [validObjectId,auth],async(req, res) =>{
    const artist = await Artist.findById(req.params.id).select("-password-__v");
    res.status(200).send({data:artist})
})

//actualizar artista por su id
router.put("/:id", [validObjectId, auth], async(req, res) =>{
    const artist = await Artist.findByIdAndUpdate(
        req.params.id,
        {$set:req.body},
        {new: true}
    ).select("-password-__v");
    res.status(200).send({data:artist})
})

//eliminar artist por su id
router.delete("/:id",[validObjectId,admin],async(req,res) =>{
    await Artist.findByIdAndDelete(req.params.id);
    res.status(200).send({message:"Artista eliminado exitosamente"})
})

module.exports = router;