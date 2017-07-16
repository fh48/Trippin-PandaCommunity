const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Login & Validation
const expressValidator = require ('express-validator');
const session = require('express-session');
var FileStore = require('session-file-store')(session);

// data base
const db = require('./db.js');
const db_init = require('./db_init.js')

// routes

var user          = require('./routes/user_rout');
var destinations  = require('./routes/dest_rout');
var topics        = require('./routes/topic_rout');
var posts         = require('./routes/post_rout');

// init app
var app = express();

//Start database
db_init.startDB();

// BodyParser Middlewares
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({extended:true}));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public'))); // build-in middleware, __dirname stores path do project directorly.

// Session Middleware
app.use(session({
  secret:'asdashjkahkh24asnasd', //key to encrypt - evailable to websever only
  resave: true,
  saveUninitialized: true,
  store: new FileStore()
  }));

// Input Validator
// Source: https://github.com/ctavan/express-validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// routes - defines where to find which request
app.use('/api/users', user);
app.use('/api/destinations', destinations);
app.use('/api/topics', topics);
app.use('/api/posts', posts);

app.listen(3000, (err,res)=>{
  if(err){
    console.log("problem with port");
  } else{
    console.log("App listening on port 3000");
  }
});
