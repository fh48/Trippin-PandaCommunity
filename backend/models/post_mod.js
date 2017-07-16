
// Attributes of a post document
var createPost = (text, topic, creator) =>{

    var post_body = {
      text:           text,
      created_at :    new Date().toISOString(),
      created_by:     creator,
      topic:          topic,
      voters:         [],
      upvotes:        0,
      downvotes:      0,
      type:           "post",
    }

  return post_body;
};

module.exports = {
  createPost
};
