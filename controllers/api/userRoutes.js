const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password']},
        where: {
        id: req.params.id
      },
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'content', 'created_at']
        }, {
          model: Comment,
          attributes: ['id', 'comment', 'created_at'],
          include: {
            model: Post,
            attributes: ['title']
          }
        }
      ]
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.post('/', (req, res) => {
    User.create({
      username: req.body.username,
      password: req.body.password
    })
      .then(dbUserData => {
          req.session.save(() => {
              req.session.user_id = dbUserData.id;
              req.session.username = dbUserData.username;
              req.session.loggedIn = true;
              res.status(201).json(dbUserData);
          });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.post('/login', async (req, res) => {
    try {
      const dbUserData = await User.findOne({ where: { username: req.body.username } });
  console.log(req.body)
      if (!dbUserData) {
        res
          .status(400)
          .json({ message: 'Incorrect username or password, please try again' });
        return;
      }
  
      const validPassword = dbUserData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res
          .status(400)
          .json({ message: 'Incorrect password, please try again' });
        return;
      }
  
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.logged_in = true;
        
        res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
  
    } catch (err) {
      console.log(err.message)
      res.status(400).json(err);

    }
  });

  router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });

  router.put('/:id', withAuth, (req, res) => {
    User.update({
        individualHooks: true,
        where: {
          id: req.params.id
        }
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  // router.delete('/:id', async, (req, res) => {
  //   User.destroy({
  //     where: {
  //       id: req.params.id
  //     }
  //   })
  //     .then(dbUserData => {
  //       if (!dbUserData) {
  //         res.status(404).json({ message: 'No user with this id' });
  //         return;
  //       }
  //       res.json(dbUserData);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.status(500).json(err);
  //     });
  // });

  router.delete('/:id', async (req, res) => {
    try {
      const dbUserData = await User.destroy({
        where: {
          id: req.params.id,
        },
      });
  
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with that id!' });
        return;
      }
  
      res.status(200).json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  
  module.exports = router;
  