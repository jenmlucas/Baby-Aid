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

// We need to pass in an answer_id and then figure out how to get it in front end logic

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
            if (!dbQuestionData) {
                res.status(404).json({ message: 'No question found with this id' });
                return;
            }

            // const question = dbQuestionData.get({ plain: true });

            const answers = [{}];

            const answerArr = dbQuestionData.dataValues.answers
            
            answerArr.forEach((answer, index)=> {
                answers[index] = {
                    id: answer.dataValues.id,
                    answer_text: answer.dataValues.answer_text,
                    question_id: answer.dataValues.question_id,
                    parent_id: answer.dataValues.parent_id,
                    created_at: answer.dataValues.created_at,
                    vote_count: answer.Votes.length
                }
            })

            const question = {
                id: dbQuestionData.dataValues.id,
                content: dbQuestionData.dataValues.content,
                title: dbQuestionData.dataValues.title,
                vote_count: dbQuestionData.dataValues.vote_count,
                created_at: dbQuestionData.dataValues.created_at,
                answers: answers
            }

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