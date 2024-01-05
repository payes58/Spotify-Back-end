const router = require("express").Router();
const{Premium, validate} = require ("../models/premiumU");
const {User} = require ("../models/user");
const auth = require ("../middleware/auth");
const validObjectId= require ("../middleware/validObjetId");
const admin = require("../middleware/admin");


//creacion cosas premium
router.post("/", auth, async (req, res) =>{
    const {error} = validate(res.body);
    if(error) return res.status(400).send({message:error.details[0].message})
    const user = await User.findById(req.user._id);
    const premium = await Premium({...req.body, user:user._id}).save();
    user.Premium_details.push(premium._id);
    await user.save();
})


//Select All 
router.get("/",admin, async(req,res) =>{
    const premium = await Premium.find().select("-password -__v");
    res.status (200).send({data:premium})
})

// tener premium requirements por Id
router.get("/:id", [validObjectId,auth],async(req, res) =>{
    const premium = await Premium.findById(req.params.id).select("-password-__v");
    res.status(200).send({data:premium})
})

//actualizar premium requirements por su id
router.put("/:id", [validObjectId, auth], async(req, res) =>{
    const premium = await Premium.findByIdAndUpdate(
        req.params.id,
        {$set:req.body},
        {new: true}
    ).select("-password-__v");
    res.status(200).send({data:premium , message:"Premium requirements actualizado correctamente"})
})

//eliminar premium requirements por su id
router.delete("/:id",[validObjectId,admin],async(req,res) =>{
    await Premium.findByIdAndDelete(req.params.id);
    res.status(200).send({message:"Premium requirements eliminado exitosamente"})
})

module.exports = router;