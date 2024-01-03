const mongoose = require ('mongoose');

module.exports = async () => {
    const connectionParams = {
    }
    try {
        await mongoose.connect(process.env.DB, connectionParams);
        console.log("Conexion a la base realizada correctamente")
    }catch (error){
        console.log("Conexion a la base fallida") 
    }
}