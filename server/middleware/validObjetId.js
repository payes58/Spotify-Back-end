const mongoose = require("mongoose");

module.exports = (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
    return req.status(404).send ({message: "Id no valido"});

    next();
}