const router = require('express').Router();
const { Parent, Question, Vote, Answer } = require("../../models");
const withAuth = require('../../utils/auth')

// Get all Parents
router.get('/', (req, res) => {
    Parent.findAll({
        attributes: { exclude: ['password']}
    })
    .then(dbParentData => res.json(dbParentData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

// Get a single parents
router.get('/:id', (req, res) => {
    Parent.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Question,
                attributes: ['id', 'content', 'title', 'created_at']
            },
            {
                model: Answer,
                attributes: ['id', 'answer_text', 'parent_id', 'question_id', 'created_at'],
                include: {
                    model: Question,
                    attributes: ['title']
                }
            },
            {
                model: Question,
                attributes: ['title'],
                through: Vote,
                as: 'voted_questions'
            }
        ]
    })
    .then(dbParentData => {
        if (!dbParentData) {
            res.status(404).json({ message: 'Parent not found!'})
            return
        }
        res.json(dbParentData)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})


// Create a Parent
router.post('/', (req, res) => {
    Parent.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbParentData => {
        req.session.save(() => {
            req.session.parent_id = dbParentData.id,
            req.session.username = dbParentData.username,
            req.session.loggedIn = true;

            res.json(dbParentData)
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

// Log a parent in
router.post('/login', (req, res) => {
    Parent.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbParentData => {
        if(!dbParentData) {
            res.status(404).json({ message: 'Parent not found' });
            return;
        }

        const validPassword = dbParentData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Wrong password' })
            return
        }
        req.session.save(() => {
            req.session.parent_id = dbParentData.id,
            req.session.username = dbParentData.username,
            req.session.loggedIn = true;

            res.json({ parent: dbParentData, message: 'You have been logged in'})
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

// Logout a parent
router.post('/logout', (req, res) => {
    if(req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end()
        });
    } else {
        res.status(404).end()
    }
});



module.exports = router