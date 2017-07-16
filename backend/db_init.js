
const cradle = require('cradle');
const db_address = require('./address.json').address;

// connect to the database
const db_func = require('./db.js');

const db = db_func.db;


var startDB = () => { // check if databse exists otherwise create it
  db.exists( (err,exists) => {
    if (err){
      console.log('error with database: ' + db_func.db_name );
    } else if (exists){
      console.log('connected with database: ' + db_func.db_name );
    } else {// create database when not existing yet
        console.log('db does not exist - is being created');
      db.create( (err)=> {
        if(!err){ console.log('new db with views created');
          createHloViews()
          createTypeViews()
        } else console.log('database couldnt be created', err);
      });
    }
  });
}

// get all objects which have a higher level object (hlo).
var  createHloViews = () => {
  db.save("_design/hlo", {
    dest: {
      map: function (doc) { // add all docs with a dest - topics
        if (doc.dest) {
          emit(doc.dest, doc);
        }
      }
    },
    topic: { // add all docs with a topic - posts
      map: function (doc) {
        if (doc.topic) {
          emit(doc.topic, doc);
        }
      }
    },
  })
};


var  createTypeViews = () => {
  // create views for all different types
  db.save('_design/types', {
    topic: {
      map: function (doc) {
        if (doc.type === "topic") {
          emit(doc.name, doc);
        };
      }
    },
    user: {
      map: function (doc) {
        if (doc.type === "user") {
          emit(doc.name, doc);
        };
      }
    },
    admin: {
      map: function (doc) {
        if (doc.type === "admin") {
          emit(doc.name, doc);
        };
      }
    },
    dest: {
      map: function (doc) {
        if (doc.type === "dest") {
          emit(doc.name, doc);
        };
      }
    },
    post: {
      map: function (doc) {
        if (doc.type === "post") {
          emit(doc.name, doc);
        };
      }
    },
  });
};


  module.exports = {
    startDB,
    createTypeViews,
    createHloViews,
  };
