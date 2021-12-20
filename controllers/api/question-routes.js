const router = require('express').Router();
const { Question, Parent, Vote, Answer } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
  Question.findAll({
    attributes: [
      'id',
      'content',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE question.id = vote.question_id)'), 'vote_count']
    ],
    order: [['created_at', 'DESC']],
    include: [
      {
        model: Answer,
        attributes: ['id', 'answer_text', 'question_id', 'parent_id', 'created_at'],
        include: {
          model: Parent,
          attributes: ['username']
        }
      },
      {
        model: Parent,
        attributes: ['username']
      }
    ]
  })
    .then(dbQuestionData => res.json(dbQuestionData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Question.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'content',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE question.id = vote.question_id)'), 'vote_count']
    ],
    include: [
      {
        model: Answer,
        attributes: ['id', 'answer_text', 'question_id', 'parent_id', 'created_at'],
        include: {
          model: Parent,
          attributes: ['username']
        }
      },
      {
        model: Parent,
        attributes: ['username']
      }
    ]
  })
    .then(dbQuestionData => {
      if (!dbQuestionData) {
        res.status(404).json({ message: 'No question found with this id' });
        return;
      }
      res.json(dbQuestionData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
  Question.create({
    title: req.body.title,
    content: req.body.content,
    parent_id: req.session.parent_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.put('/vote', withAuth, (req, res) => {
  if (req.session) {
    Vote.findOne({
      where: {
        parent_id: req.session.parent_id,
        question_id: req.body.question_id
      }
    }).then(voteData => {
      if (!voteData) {
        Question.vote({ ...req.body, parent_id: req.session.parent_id }, { Vote, Answer, Parent })
          .then(updatedVoteData => {
            res.json(updatedVoteData)
          })
      } else {
        res.status(409).json({ message: "You have already voted" })
        return;
      }
    })
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
  }
});

router.put('/:id', withAuth, (req, res) => {
  Question.update(
    {
      title: req.body.title,
      content: req.body.content
    },
    {
      where: {
        id: req.params.id
      }
    })
    .then(dbQuestionData => {
      if (!dbQuestionData) {
        res.status(404).json({ message: 'No question found with this id' })
        return
      }
      res.json(dbQuestionData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})


router.delete('/:id', withAuth, (req, res) => {
  Question.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: ' No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;