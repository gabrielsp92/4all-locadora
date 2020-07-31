'use strict';
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsToMany(models.Role, {
        through: 'UserRole',
        as: 'roles',
        foreignKey: 'userId',
        otherKey: 'roleId'
      });
    }
    static generateHash(password) {
      return bcrypt.hash(password, bcrypt.genSaltSync(8));
    }
    static async validatePassword(password, hash) {
      return bcrypt.compare(password, hash);
    }

  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    refreshToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user, options) => {
        user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(8));
      },
      afterCreate: async (user, options) => {
        sequelize.models.UserRole.create({
          userId: user.id, // User Id
          roleId: 1, // Default Role ID
        })
      }
    }
  });
  return User;
};
