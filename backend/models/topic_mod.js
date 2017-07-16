// Attributes of a destination document
var createTopic = (title, dest, creator) =>{

    var topic_body = {
      title:             title,
      created_at:        new Date().toISOString(),
      created_by:        creator,
      dest:              dest,
      post_count:        0,
      voters:            [],
      upvotes:           0,
      downvotes:         0,
      type:              "topic"

    }

  return topic_body;
};

module.exports = {
  createTopic
};
