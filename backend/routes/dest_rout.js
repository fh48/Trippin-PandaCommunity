const express = require('express')
const router = express.Router();
const q = require('q')
//user sessions
const sessions = require('express-session');
var FileStore = require('session-file-store')(sessions);

const dest_mod = require('../models/dest_mod');
const db = require('../db.js');


// GET  all Destination
router.get('/', (req, res)=>{
  db.selectDocumentByType("dest")
  .then(  (doc) => {res.status(200).send(doc)})
  .catch( (err) => {res.status(400)});

});


// POST a Destination
router.post('/', (req, res)=>{

  var name = req.body.name ;
  var country = req.body.country;
  var img = req.body.img;
  var inputErrors;
  var destbody;


  // Input validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('country', 'county is required').notEmpty();
  req.checkBody('img', 'image is required').notEmpty();

  inputErrors = req.validationErrors();

  if(inputErrors){
    res.status(400).send(inputErrors);
    return;

  }else{

    destbody = dest_mod.createDest(name,country,img); // take dest input from req and pass it to dest model

    db.addDocumentToDB_noID(destbody)
    .then((doc) =>{res.status(201).send(doc)})
    .catch((err)=>{res.status(400).send(err)});

  }

});


router.delete('/:dest_id', (req,res) =>{

  var id = req.params.dest_id


  db.selectDocumentByHlo("topic",id)
  .then((array) =>{
    return db.deleteDocsByArray(array)})
  .then(()      =>{
    return db.deleteDocument(id)})
  .then(()      =>{
    res.status(200).send()})
  .catch((err)  =>{
    res.status(400).send(err);}
  );

});


module.exports = router;
