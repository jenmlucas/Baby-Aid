const router = require('express').Router();
const { Answer } = require('../../models');
const withAuth = require('../../utils/auth')

router.get('/', (req, res) => {
    Answer.findAll()
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});



router.post('/', withAuth, (req, res) => {
        Answer.create({
            answer_text: req.body.answer_text,
            parent_id: req.session.parent_id,
            question_id: req.body.question_id
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});


router.delete('/:id', withAuth, (req, res) => {
    Answer.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(404).json({ message: 'No answer found with this id' });
                return;
            }
            res.json(dbCommentData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

module.exports = router;