const { Post } = require('../models');

const postData = [
    {
      "title": "This is a post title.",
      "content": "Boy this MVC homework  sure is fun.",
      "user_id": 1
    }, {
        "title": "This is a post title.",
        "content": "The JS quiz was the most interesting.",
        "user_id": 2
    }, {
        "title": "This is a title.",
        "content": "Inquirer is surprisingly hard to work with.",
        "user_id": 3
    }
  ];

  const seedPost = () => Post.bulkCreate(postData);

module.exports = seedPost;
  