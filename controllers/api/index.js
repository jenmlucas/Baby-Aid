const router = require("express").Router();
const parentRoutes = require('./parent-routes');
const questionRoutes = require('./question-routes');
// const answersRoutes = require('./answers-routes');

router.use('/parents', parentRoutes);
router.use('/questions', questionRoutes);
// router.use('/answers', answerRoutes);

module.exports = router;