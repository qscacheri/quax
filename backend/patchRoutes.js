const express = require('express');
const db = require('./db')
const authentication = require('./authentication')
const cors = require('cors')
const multer = require('multer')
const bodyParser = require('body-parser');
const Jimp = require('jimp');
const fs = require('fs')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './previews')
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body.id}.jpeg`)
    }
})

var preview = multer({ storage: storage })
module.exports = function (app) {
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: true }));

    // loads all users patches
    app.get('/my-patches', authentication.authenticateToken, async (req, res) => {
        const patches = await db.getMyPatches(req.username)
        res.send(patches)
    })

    // gets patch by id
    app.get('/patch', authentication.authenticateToken, async (req, res) => {
        const patch = await db.getPatch(req.query.id)
        res.send(patch)
    })

    // creates new patch
    app.post('/new-patch', authentication.authenticateToken, async (req, res) => {
        
        const id = await db.newPatch(req.username)
        console.log(id);
        
        Jimp.read(`./previews/empty_preview.jpeg`, (err, previewImg) => {
            if (err) throw err;
            previewImg.write(`./previews/${id}.jpeg`)
            res.sendStatus(id ? 200 : 404)
        })

    })

    // changes patch name by id
    app.post('/update-patch-name', authentication.authenticateToken, async (req, res) => {
        const patchID = req.body.patchID
        const newPatchName = req.body.newPatchName
        db.updatePatchName(patchID, newPatchName)
    })

    // changes patch data by id
    app.post('/update-patch', authentication.authenticateToken, async (req, res) => {
        await db.updatePatch(req.body.id, req.body.patchData)
        res.sendStatus(200)
    })

    app.post('/update-preview', preview.single('preview'), authentication.authenticateToken, async (req, res) => {
        Jimp.read(`./previews/${req.body.id}.jpeg`, (err, previewImg) => {
            if (err) throw err;
            previewImg.resize(512, 512)
            previewImg.write(`./previews/${req.body.id}.jpeg`)
        })
        res.send(200)
    })

    // deletes patch
    app.post('/delete-patch', authentication.authenticateToken, async (req, res) => {
        await db.deletePatch(req.body.patchID)
        res.sendStatus(200)
    })

}
