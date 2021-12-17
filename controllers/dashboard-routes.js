const router = require('express').Router();
const sequelize = require('../config/connection');
const { Question, Parent, Answer } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Question.findAll({
        where: {
            parent_id: req.session.parent_id
        },
        attributes: [
            'id',
            'title',
            'created_at',
            'content',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE question.id = vote.question_id)'), 'vote_count']
        ],
        include: [
            {
                model: Answer,
                attributes: ['id', 'answer_text', 'question_id', 'parent_id', 'created_at'],
                include: {
                    model: Parent,
                    attributes: ['username'],
                }
            },
            {
                model: Parent,
                attributes: ['username'],
            }
        ]
    })
    .then(dbQuestionData => {
        const questions = dbQuestionData.map(question => question.get({ plain: true }));
        res.render('dashboard', {questions, loggedIn: true})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

router.get('/edit/:id', withAuth, (req, res) => {
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
                return
            }
            // serialize the data
            const question = dbQuestionData.get({ plain: true });

            // pass data to template
            res.render('edit-question', {
                question,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err);
        })
})


module.exports = router;