const router = require("express").Router();
const {Playlist} = require("../models/playlist");
const {Song} = require("../models/song");
const auth = require ("../middleware/auth");

router.get("/", auth, async(req, res) =>{
    const search = req.query.search;
    if(search !== ""){
        const songs = await Song.find({
            name: {$requex: search, $options:"i"}
        }).limit(10);
        const playlist = await Playlist.find({
            name: {$requex: search, $options:"i"}
    }).limit(10)
        const result = {songs,playlist}
        res.status(200).send({data: result})
    }else{
        res.status(200).send({})
    }
})

module.exports = router;