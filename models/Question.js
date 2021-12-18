const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


class Question extends Model {
    static vote(body, models) {
        return models.Vote.create({
            parent_id: body.parent_id,
            question_id: body.question_id,
            answer_id: null
        }).then(() => {
            return Question.findOne({
                where: {
                    id: body.question_id
                },
                attributes: [
                    'id',
                    'content',
                    'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE question.id = vote.question_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
}

Question.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4]
            }
        },
        parent_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'parent',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'question'
    }
);

module.exports = Question;