const express = require('express');
const router = express.Router();
const q = require('q')
//user sessions
const sessions = require('express-session');
var FileStore = require('session-file-store')(sessions);

const post_mod = require('../models/post_mod');
const db = require('../db.js');


//GET all posts by // single post
router.get('/:id', (req,res) =>{

  var id = req.params.id

  // topic ID (all) // post ID (single)
  db.returnSingleDocument(id)
    .then((doc)=>{

      switch (doc.type) {
        case "post": console.log("found a topic");
                      return doc;
        break;

        case "topic":  console.log("found a destination, id = "+doc._id);
                      return db.selectDocumentByHlo("topic", doc._id);
        break;
      }

    })

    .then((doc)=>{
      res.status(200).send(doc);})
    .catch((err)=>{
      res.status(400).send(err)})
});


// PATCH edit a post attribute
router.patch('/:post_id', (req, res)=>{

  var user     = req.session.uniqueID;
  var id       = req.params.post_id;
  var newText = req.body.newText;

db.authCreator(id,user)
  .then((doc)=>{
    return db.returnSingleDocument(id)})
  .then((doc)=>{ console.log("post" + doc);
    return db.changeSingleAttribute(id,"text", newText)})
  .then((doc) =>{
    res.status(200).send(doc)})
  .catch((err)=>{
    res.status(400).send(err)});

});


// POST a post
router.post('/', (req, res)=>{

  var creator = req.session.uniqueID;
  // user need to be logged in to post something.
  if(!creator){res.status(401).end()}

  var text  = req.body.text ;
  var topic = req.body.topic;

  var inputErrors;
  var postbody;
  var postid;

  // to Check inputs for correctness
  req.checkBody('text', 'Text is required').notEmpty();

  inputErrors = req.validationErrors();

  if(inputErrors){
    res.status(400).send(inputErrors); return;
  } else{

    postbody = post_mod.createPost(text, topic, creator);

    db.addDocumentToDB_noID(postbody)
    .then((doc)=>{ postid = doc.id
      return db.returnSingleDocument(creator)})
    .then((doc)=>{
      doc.postsCreated.push(postid);
      return db.changeSingleAttribute(creator, "postsCreated", doc.postsCreated)})
    .then((doc)=>{
      res.status(201).send(doc)})
    .catch((err)=>{
      res.status(400).send(err)});

  }

});


//DELETE single post
router.delete('/:id', (req, res) =>{

  var user = req.session.uniqueID;
  var id   = req.params.id;

  db.authCreator(id,user).then((doc)=>{
      return db.deleteDocument(id)})
    .then((doc)=>{
      res.status(200).send(doc)})
    .catch((err)=>{
      res.status(400).send(err)});

});


// POST a vote
router.post('/:post_id/vote/', (req, res)=>{

  var id = req.params.post_id;
  var voteType = req.body.vote;
  var voter = req.session.uniqueID;

  var attToChange;
  var value;
  var post_obj;

  db.authVoter(id,voter)
    .then((doc) => {
      post_obj = doc

      if (voteType == "+") {
        value = parseInt(post_obj.upvotes);
        attToChange = "upvotes";
      }else {
        value = parseInt(post_obj.downvotes);
        attToChange = "downvotes";}})

    .then(()=>{
      return db.changeSingleAttribute(id, attToChange, value +1)})
    .then(()=>{
      post_obj.voters.push(voter);
      return db.changeSingleAttribute(id, "voters",post_obj.voters)})
    .then(()=>{
      res.status(200).send()})
    .catch((err)=>{
      res.status(403).send(err)});

});

module.exports = router;
