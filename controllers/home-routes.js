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


// does not get parent.username
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

            
            const answerArr = dbQuestionData.dataValues.answers
        

            // implied return with () instead of bracket
            const answers = answerArr.map(answer => (
                {
                    id: answer.dataValues.id,
                    answer_text: answer.dataValues.answer_text,
                    question_id: answer.dataValues.question_id,
                    parent_id: answer.dataValues.parent_id,
                    created_at: answer.dataValues.created_at,
                    vote_count: answer.Votes.length,
                    parent_username:answer.dataValues.parent.dataValues.username
                }
            ))

            const question = {
                id: dbQuestionData.dataValues.id,
                username: dbQuestionData.dataValues.parent.dataValues.username,
                content: dbQuestionData.dataValues.content,
                title: dbQuestionData.dataValues.title,
                vote_count: dbQuestionData.dataValues.vote_count,
                created_at: dbQuestionData.dataValues.created_at,
                answers: answers
            }
            console.log(question)
            
            
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