const Parent = require("./Parent");
const Question = require("./Question");
const Vote = require('./Vote');
const Answer = require('./Answer');

// create associations
Parent.hasMany(Question, {
    foreignKey: 'parent_id'
});

Question.belongsTo(Parent, {
    foreignKey: 'parent_id'
})

Parent.belongsToMany(Question, {
    through: Vote,
    as: 'voted_questions'
});

Question.belongsToMany(Parent, {
    through: Vote,
    as: 'voted_questions'
});

Vote.belongsTo(Parent);

Vote.belongsTo(Question);

Parent.hasMany(Vote);

Answer.belongsTo(Parent, {
    foreignKey: 'parent_id'
});

Parent.hasMany(Answer, {
    foreignKey: 'parent_id'
});

Question.hasMany(Answer, {
    foreignKey: 'question_id'
});


Parent.belongsToMany(Answer, {
    through: Vote,
    as: 'voted_answers',
    foreignKey: 'parent_id'
});

Answer.belongsToMany(Parent, {
    through: Vote,
    as: 'voted_answers',
    foreignKey: 'answer_id'
});

Vote.belongsTo(Answer, {
    foreignKey: 'answer_id'
});

Answer.hasMany(Vote, {
    foreignKey: 'answer_id'
});

module.exports = { Parent, Question, Vote, Answer };