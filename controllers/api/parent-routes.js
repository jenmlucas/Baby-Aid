const router = require('express').Router();
const { Parent, Question, Vote, Answer } = require("../../models");


// Get all Parents
router.get('/', (req, res) => {
    Parent.findAll({})
    .then(dbParentData => res.json(dbParentData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

// Get a single parents
router.get('/:id', (req, res) => {
    Parent.findOne({
        where: {
            id: req.params.id
        }
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
    .then(dbParentData => res.json(dbParentData))
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
        res.json(dbParentData)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})



module.exports = router