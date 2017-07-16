const bcrypt = require('bcryptjs');

// Attributes of a user document
var createUser = (password) =>{

    var user_body = {
              password:       password,
              date:           new Date().toISOString(),
              type:           "user",
              posts:          0,
              postsCreated:   [],
              topics:         0,
              topicsCreated:  [],
              avatar:         0
             }

  return user_body;
};


//  Bcypt library creates hashed password
var hashPW = (clear_password) => {
  return new Promise((resolve, reject) =>{

    bcrypt.genSalt(10, (err, salt) =>{

      if(!err){
        bcrypt.hash(clear_password, salt, (err, hash) =>{
        resolve(hash)});
      } else{
        reject(err)}
    });

  });
};


module.exports = {
  createUser,
  hashPW
};
