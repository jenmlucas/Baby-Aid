const router = require('express').Router();
const { Answer } = require('../../models');

router.get('/', (req,res) => {
    //Access our User model and run .findAll( method)
    Answer.findAll({ 
        attributes: { exclude: [ 'password'] },
       
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET /api/user/

router.post('/', (req, res) => {
    Answer.create({
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
        Answer.destroy({
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