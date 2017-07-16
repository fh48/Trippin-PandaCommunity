
// Attributes of a destination document
var createDest = (name, country,img) =>{

    var dest_body = {
      type:       "dest",
      name:       name,
      created_at: new Date().toISOString(),
      country:    country,
      img:        img

    }

  return dest_body;
};

module.exports = {
  createDest
};
