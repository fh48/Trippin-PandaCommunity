const express = require('express');
const router = express.Router();
const q = require('q')
// user sessions
const sessions = require('express-session');
var FileStore = require('session-file-store')(sessions);

const topic_mod = require('../models/topic_mod');
const db = require('../db.js');



//GET all topics by // single topic
router.get('/:id', (req,res) =>{  //TODO: TESTED - WORKS

  var id = req.params.id

  // dest ID (all) // topic ID (single)
  db.returnSingleDocument(id)
    .then((doc)=>{

      switch (doc.type) {
        case "topic": console.log("found a topic");
                      return doc;
        break;
        case "dest":  console.log("found a destination, id = "+doc._id);
                      return db.selectDocumentByHlo("dest", doc._id);
        break;
      }
    })

    .then((doc)=>{
      res.status(200).send(doc)})
    .catch((err)=>{
      res.status(400)})

});



//POST a Topic
router.post('/', (req, res)=>{

  var creator = req.session.uniqueID;
  // user need to be logged in to post something.
  if(!creator){res.status(401).end()}

  var title = req.body.title ;
  var dest = req.body.dest;
  var topicbody;
  var inputErrors;
  var topicId;
  // to Check inputs for correctness
  req.checkBody('title', 'Name is required').notEmpty();

  inputErrors = req.validationErrors();

  if(inputErrors){
    res.status(400).send(inputErrors);
  } else{

    topicbody = topic_mod.createTopic(title,dest, creator);

    db.addDocumentToDB_noID(topicbody)
    .then((doc)=>{ topicId = doc.id
      return db.returnSingleDocument(creator)})
    .then((doc)=>{
      doc.topicsCreated.push(topicId);
      return db.changeSingleAttribute(creator, "topicsCreated", doc.topicsCreated)})
    .then((doc)=>{
      res.status(201).send(doc)})
    .catch((err)=>{
      res.status(400).send(err)});
  }

});












// PATCH edit a Topic attribute
router.patch('/:topic_id', (req, res)=>{

  var user     = req.session.uniqueID;
  var id       = req.params.topic_id;
  var newTitle = req.body.newTitle;

db.authCreator(id,user)
  .then((doc)=>{
    return db.returnSingleDocument(id)})
  .then((doc)=>{ console.log("post" + doc);
    return db.changeSingleAttribute(id,"title", newTitle)})
  .then((doc) =>{
    res.status(200).send(doc)})
  .catch((err)=>{
    res.status(400).send(err)});

});


// DELETE a topic & belonging posts
router.delete('/:topic_id', (req, res) =>{

  var user = req.session.uniqueID;
  var id   = req.params.topic_id;

  db.authCreator(id,user)
    .then((msg)=>{console.log(msg)
      return db.selectDocumentByHlo("topic",id)})
    .then((array)=>{ console.log(array)
      return db.deleteDocsByArray(array)})
    .then((msg)  =>{ console.log(msg);
      return db.deleteDocument(id)})
    .then(()  =>{
      res.status(200).send()})
    .catch((err) =>{ res.status(400).send(err)});

});


// POST a vote
router.post('/:topic_id/vote/', (req, res)=>{

  var id = req.params.topic_id;
  var voteType = req.body.vote;
  var voter = req.session.uniqueID;

  var attToChange;
  var value;
  var topic_obj;

  db.authVoter(id,voter)
  .then((doc)=>{
    topic_obj = doc

    if (voteType == "+") {
      value = parseInt(topic_obj.upvotes);
      attToChange = "upvotes";
    }else {
      value = parseInt(topic_obj.downvotes);
      attToChange = "downvotes";}})

  .then(()=>{
    return db.changeSingleAttribute(id, attToChange, value+1)})
  .then(()=>{
    topic_obj.voters.push(voter);
    return db.changeSingleAttribute(id, "voters",topic_obj.voters)})
  .then(()=>{
    res.status(200).send()})
  .catch((err)=>{
    res.status(403).send(err)});

});

module.exports = router;
