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
    as: 'voted_questions',
    foreignKey: 'parent_id'
});

// setting relationship
// one Question can belong to many parents
Question.belongsToMany(Parent, {
    through: Vote,
    as: 'voted_questions',
    foreignKey: 'question_id'
});

Vote.belongsTo(Parent, {
    foreignKey: 'parent_id'
});

Vote.belongsTo(Question, {
    foreignKey: 'question_id'
});

Parent.hasMany(Vote, {
    foreignKey: 'parent_id'
});

Question.hasMany(Vote, {
    foreignKey: 'question_id'
});

Answer.belongsTo(Parent, {
    foreignKey: 'parent_id'
});

Parent.hasMany(Answer, {
    foreignKey: 'parent_id'
});

Question.hasMany(Answer, {
    foreignKey: 'question_id'
});

module.exports = { Parent, Question, Vote, Answer };