const cradle = require('cradle');
const q = require('q')

// Connect to the database
const db_address = require('./address.json').address;
const db_name = 'tpandadb'
const db = new(cradle.Connection)(db_address, 20656, {
      auth: { username: 'ic48', password: 'L9VfHfLK' }
  }).database(db_name);



// Used for checking if picked user name is still available  - true: available
var checkUserName = (id) =>{
  return new Promise((resolve, reject) =>{
    db.get(id, (err,doc) =>{
      if(doc){reject("username already taken")}else{resolve()}
     });
   });
 }


var returnSingleDocument = (id) =>{
  return new Promise((resolve, reject) =>{
    db.get(id, (err,doc) =>{

      if(id){resolve(doc)

      } else{reject("Document doesn't exists")
      }

    });
  });
}






var authCreator = (id, usersession) =>{
  return new Promise((resolve, reject) =>{
    db.get(id, (err,doc) =>{

      if(usersession == "admin" || doc.created_by == usersession){
        resolve(doc)
      } else {
        reject(err)
      }

    });
});
}

var authVoter = (id, usersession) =>{
  return new Promise((resolve, reject) =>{

    db.get(id, (err,doc) =>{
      console.log("found in authVoter: "+ doc);

      for (var i = 0; i <doc.voters.length; i++) {
        console.log(doc.voters[i]);
        if (doc.voters[i] == usersession){reject()}
      }
      resolve(doc);

    });
  });
}


// function adding a docuement to the db
var addDocumentToDB = (username,attributes)  => {
  return new Promise((resolve, reject) =>{
    db.save(username, attributes, (err, res) =>{
       if(!err){
         resolve(res)
       }else{
         reject(err)
       }
     });
  });
};

// function adding a docuement to the db
var addDocumentToDB_noID = (attributes)  => {
  return new Promise((resolve, reject) =>{
    db.save(attributes, (err, res) =>{
       if(!err){
         resolve(res)
       }else{
         reject(err)
       }
     });
  });
};


// used to retrieve all destinations at once
var selectDocumentByType = (type) => {
  return new Promise((resolve, reject) => {
    db.view(`types/${type}`, (err, res) => {
        if(!err){
        resolve(res);
      } else {
        reject();
      }
    });
  });
};


// Select document by higher level object (Hlo)
// hlo types:
//    destination for topics
//    topics for posts
// hlo values:
//    search
var selectDocumentByHlo = (hlotype,hloValue) => {
  return new Promise((resolve, reject) => {
    db.view(`hlo/${hlotype}`, {key: hloValue}, (err, res) => {
      if(!err){
        resolve(res); // output all objects with passed in hlo
      } else {
        reject(err);
      }
    });
  });
};



// loops through and array of topics and returns their post objects
var selectDocsByHlo_Array = (hlotype, hloValueArray) =>{
  return new Promise((resolve, reject) =>{

    var selected = 0;
    var selected_Array =[]

    if(!hloValueArray.length){
      resolve("nothing to select")
    }

    for(var i = 0; i < hloValueArray.length; i++) {

      db.view(`hlo/${hlotype}`, {key: hloValueArray[i].id}, (err, res) => {

        //console.log("single view responds: "+ res);
        if (err) {
          reject (err);
          return;

        } else{
         selected_Array.push.apply(selected_Array,res)
        }

        if(++selected == hloValueArray.length && hloValueArray.lenth != 0) {
          resolve(selected_Array);
          console.log("done");//break;
        }

      });
    }
  });
}





// change a single attribute
var changeSingleAttribute = (id, attToChange, NewValue) => {
  return new Promise((resolve, reject) => {
  // update the single selected attribute
  var attribute = { [attToChange]: NewValue} //attribute object
  console.log("Attribute is: " + attToChange);
  console.log("Attribute Value  is: " + NewValue);

    db.merge(id, attribute, (err,res) =>{
      if(!err){
        resolve('attribute replaced')
      } else {
        reject('error - attribute might not existing'+err)
      }
    });
  });
}


// delete user docuement
var deleteDocument = (id) => {
  return new Promise((resolve, reject) => {
    db.remove(id, (err, res) => {
      if(!err){
        resolve(res);
      } else{
        reject(err)
      }
    });
  });
};

var deleteDocsByArray = (array) =>{
  return new Promise((resolve, reject) =>{

    var deleted = 0;

    if(!array.length){
      resolve("nothing to delete")
    } else{

      for(var i = 0; i < array.length; i++) {

        db.remove(array[i].id, (err,res) => {
            if (err){ reject(err)}

            if (++deleted == array.length) {
            resolve(( "deleted"));
            }
        });


      }
    }
  });
}




//************************************ not activly used

// destroy database
var destroyDB = (dbName) =>{
        if (dbName) {
        console.log(`database ${dbName} has been destroyed`);
        db.destroy(dbName)
      } else {
        console.log("database couldn't be destroyed");
      }
 };




module.exports = {
  db,
  db_name,

  destroyDB,


  authCreator,
  authVoter,

  returnSingleDocument,

  selectDocumentByType,
  selectDocumentByHlo,
  selectDocsByHlo_Array,


  checkUserName,

  addDocumentToDB,
  addDocumentToDB_noID,


  changeSingleAttribute,

  deleteDocument,
  deleteDocsByArray
};
