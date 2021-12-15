const { Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Vote extends Model {};

Vote.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        moduleName: 'vote'
    }
)

module.exports = Vote;