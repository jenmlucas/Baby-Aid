const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt')
const sequelize = require('../config/connection');

// create our Parent model
class Parent extends Model {
    // set up a method to run on instance data (per Parent) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password)
    }
};

// create fields/columns for Parent model
Parent.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4]
            }
        }
    },
    {
        hooks: {
            async beforeCreate(newParentData) {
                newParentData.password = await bcrypt.hash(newParentData.password, 10);
                return newParentData;
            }
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'parent'
    }
);

module.exports = Parent;
