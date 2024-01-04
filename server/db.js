const mongoose = require ('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log("Conexion a la base realizada correctamente")
    }catch (error){
        console.log("Conexion a la base fallida") 
    }
}