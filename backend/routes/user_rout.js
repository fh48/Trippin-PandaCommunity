const express = require('express');
const router = express.Router();
const q = require('q')
//user sessions
const sessions = require('express-session');
var FileStore = require('session-file-store')(sessions);
var session;

const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const user_mod = require('../models/user_mod');
const db = require('../db.js');


// POST login a user
router.post('/login', (req, res) =>{

  var username = req.body.username;
  var password = req.body.password;
  var tem_doc;

  db.returnSingleDocument(username)
    .then((doc)=>{ tem_doc = doc
      return bcrypt.compare(password, doc.password)})
    .then((doc)=>{ // password is verified & session is set up
      session  = req.session;
      session.uniqueID = username;
      res.status(200).send(tem_doc)})
    .catch((err)=>{
      res.status(401).send(err)})

});


// end session
router.get('/logout', (req,res) =>{
  req.session.destroy();
  res.status(200).send();

});



// Sign-up post
router.post('/signup', (req, res) =>{ //TODO: TESTED - WORKS

  var username    = req.body.username;
  var password    = req.body.password;

  var inputErrors;
  var userbody;

  //checking if user entered all required fields
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();

   inputErrors = req.validationErrors();

  if(inputErrors){
    res.status(400).send(inputErrors); return;
  } else{

    // User with a hashed password is being created.
    db.checkUserName(username)
      .then(()=>{
        return user_mod.hashPW(password)})
      .then((hashpw)=>{
        userbody = user_mod.createUser(hashpw);
        return db.addDocumentToDB(username, userbody)})
      .then((doc)=>{
        session  = req.session;
        session.uniqueID = username;
        return db.returnSingleDocument(username)})
      .then((doc)=>{res.status(201).send(doc)})
      .catch((err)=>{
        res.status(400).send(err);
      });
  };

});


// Get a single users data
router.get('/', (req, res) =>{

  var user = req.session.uniqueID

  if (user) {
    db.returnSingleDocument(user)
    .then((doc)=>{res.status(200).send(doc)})
    .catch((doc)=>{res.status(404).send(doc)})
  } else {
    res.status(401).send()
  }

});

// change attribue of user
router.patch('/', (req, res) =>{

  var user = req.session.uniqueID
  var newValue = req.body.newValue

  if (user) {
    db.returnSingleDocument(user)
    .then((doc)=>{
    db.changeSingleAttribute(doc.id, "avatar", newValue)})
      .then((doc)=>{  res.status(200).send(doc)})
      .catch((err)=>{ res.status(404).send(err)})
  } else {
    res.status(401).send()
  }



});



//DELETE single item
router.delete('/', (req, res) =>{

  var sessio_userid = req.session.uniqueID

  if (sessio_userid != "admin") {

  db.deleteDocument(sessio_userid)
    .then((doc)=>{
      res.status(200).send(doc)})
    .catch((err)=>{
      res.status(400).send(err)});

  } else {
    res.status(400).send("Only users can delete themselves");

  }

});



module.exports = router
