const router = require("express").Router();
const parentRoutes = require('./parent-routes');
const questionRoutes = require('./question-routes');
// const answersRoutes = require('./answers-routes');

router.use('/users', parentRoutes);
router.use('/questions', questionRoutes);
// router.use('/comments', answerRoutes);

module.exports = router;