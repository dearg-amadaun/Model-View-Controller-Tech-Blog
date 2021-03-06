const { Comment } = require('../models');

const commentData = [
  {
      "comment": "This is a comment seed.",
      "user_id": 1,
      "post_id": 1
    }, {
      "comment": "Comment seeding test #2",
      "user_id": 2,
      "post_id": 2
    }, {
      "comment": "Amiko",
      "user_id": 3,
      "post_id": 3
    }
  ];

  const seedComment = () => Comment.bulkCreate(commentData);

  module.exports = seedComment;
  