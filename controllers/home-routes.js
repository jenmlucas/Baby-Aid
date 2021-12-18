const router = require('express').Router();
const sequelize = require('../config/connection');
const { Question, Parent, Answer, Vote } = require('../models');

router.get('/', (req, res) => {
    Question.findAll({
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
                attributes: ['id', 'answer_text', 'parent_id', 'question_id', 'created_at'],
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
        .then((dbParentData) => {
            const questions = dbParentData.map((question) => question.get({ plain: true }));
            res.render('homepage', {
                questions,
                loggedIn: req.session.loggedIn
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/')
        return;
    }

    res.render('login')
})


router.get('/question/:id', (req, res) => {
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
                attributes: ['id', 'answer_text', 'question_id', 'parent_id', 'created_at',
                [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE answer_id = vote.answer_id)'), 'vote_count']
            ],
                include: [
                    {
                    model: Parent,
                    attributes: ['username']
                    },
                    {
                    model: Vote,
                    attribute: ['id']
                    }
                ]
            },
            {
                model: Parent,
                attributes: ['username']
            }
            
        ]
    })
        .then(dbQuestionData => {
            ///.map somewhere in here! 
            console.log(dbQuestionData)
            console.log(dbQuestionData.dataValues.answers)
            if (!dbQuestionData) {
                res.status(404).json({ message: 'No question found with this id' });
                return;
            }

            // serialize the data
            const question = dbQuestionData.get({ plain: true });
            
            // pass data to template
            res.render('single-question', {
                question,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;