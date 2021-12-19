const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Answer extends Model { 
    static vote(body, models) {
        return models.Vote.create({
          parent_id: body.parent_id,
          answer_id: body.answer_id
        }).then(() => {
          return Answer.findOne({
            where: {
              id: body.answer_id
            },
            attributes: [
              'id',
              'answer_text',
              'parent_id',
              'question_id',
              'created_at',
              [
                sequelize.literal('(SELECT COUNT(*) FROM vote WHERE answer.id = vote.answer_id)'),
                'vote_count'
              ]
            ]
          });
        });
      }
};

Answer.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        answer_text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4]
            }
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {   
                model: 'parent',
                key: 'id'
            }
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'question',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'answer'
    }
)

module.exports = Answer;