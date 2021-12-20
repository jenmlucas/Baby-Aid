const router = require('express').Router();
const { Answer, Question, Vote, Parent } = require('../../models');
const withAuth = require('../../utils/auth')

router.get('/', (req, res) => {
    Answer.findAll({
        attributes: [
            'id',
            'answer_text',
            'parent_id',
            'question_id',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE answer.id = vote.answer_id)'), 'vote_count']
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Question,
                attributes: ['id', 'title', 'content', 'parent_id', 'created_at'],
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
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/:id', (req, res) => {
    Answer.findOne({
        attributes: [
            'id',
            'answer_text',
            'parent_id',
            'question_id',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE answer.id = vote.answer_id)'), 'vote_count']
        ],
        order: [['created_at', 'DESC']],
        include: [
            // include the Comment model here:
            {
                model: Question,
                attributes: ['id', 'title', 'content', 'parent_id', 'created_at'],
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
        .then(dbCommentData => res.json(dbCommentData))
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
                answer_id: req.body.answer_id
            }
        }).then(voteData => {
            if (!voteData) {
                Answer.vote({ ...req.body, parent_id: req.session.parent_id }, { Vote, Question, Parent })
                    .then(updatedAnswerVoteData => res.json(updatedAnswerVoteData))
            } else {
                res.status(409).json({ message: "You have already voted" })
                return;
            }
        }).catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    }
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