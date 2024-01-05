const router = require("express").Router();
const{Premium, validate} = require ("../models/premiumU");
const {User} = require ("../models/user");
const auth = require ("../middleware/auth");
const validObjectId= require ("../middleware/validObjetId");
const Joi = require ('joi');
const admin = require("../middleware/admin");


//creacion cosas premium
router.post("/", auth, async (req, res) =>{
    const {error} = validate(res.body);
    if(error) return res.status(400).send({message: error.details[0].message})
    const user = await User.findById(req.user._id);
    const premium = await Premium({...req.body,user:user._id}).save();
    user.premium.push(premium._id);
    await user.save();

    res.status(201).send({message: "Requerimientos premium creados correctamente"});
})


//Select All 
router.get("/",admin, async(req,res) =>{
    const users = await User.find().select("-password -__v");
    res.status (200).send({data:users})
})

//user por Id
router.get("/:id", [validObjectId,auth],async(req, res) =>{
    const user = await User.findById(req.params.id).select("-password-__v");
    res.status(200).send({data:user})
})

//actualizar user por su id
router.put("/:id", [validObjectId, auth], async(req, res) =>{
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {$set:req.body},
        {new: true}
    ).select("-password-__v");
    res.status(200).send({data:user})
})

//eliminar user por su id
router.delete("/:id",[validObjectId,admin],async(req,res) =>{
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send({message:"Usuario eliminado exitosamente"})
})

module.exports = router;