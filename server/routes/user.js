const router = require("express").Router();
const{User, validate} = require ("../models/user");
const bcrypt = require ("bcrypt");
const auth = require ("../middleware/auth");
const validObjectId= require ("../middleware/validObjetId");
const admin = require("../middleware/admin");


//creacion del user
router.post("/", async(req, res) =>{
    const{error} = validate(req.body);
    if(error)return res.status(400).send({ message: error.details[0].message});

    const user = await User.findOne({email: req.body.email});
    if(user)
    return res.status(403).send({message:"Este correo ya existe dentro de la base"})

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    let newUser = await new User({
        ...req.body,
        password: hashPassword
    }).save();

    newUser.password = undefined
    newUser.__v = undefined;

    res.status(200).send({data: newUser,message:"Cuenta creada exitosamente" })
});

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