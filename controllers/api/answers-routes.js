const router = require('express').Router();
const { Comment } = require('../../models');

router.get('/', (req,res) => {
    //Access our User model and run .findAll( method)
    User.findAll({ 
        attributes: { exclude: [ 'password'] },
       
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET /api/user/1
router.get('/:id', (req,res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
    
    include: [
        {
            model: Answers,
            attributes: ['id', 'answer_text', 'question_id', 'parent_id']
          },
          {
            model: Answers,
            attributes: ['answers'],
            through: questions,
            as: 'question_id'
          }
      ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No answer found with this id'});
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
    Answers.create({
        answer_text: req.body.answer_text,
        parent_id: req.body.parent_id,
        question_id: req.body.question_id
      })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    
    });


    router.delete('/:id', (req, res) => {
        Answers.destroy({
            where: {
                id: req.params.id
            }
        })
        then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message:'No answer found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    
    });

module.exports = router;