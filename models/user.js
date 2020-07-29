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
      this.belongsToMany(models.Movie, {
        through: 'Rent',
        as: 'rents',
        foreignKey: 'userId',
        otherKey: 'movieId'
      });
    }
    static generateHash(password) {
      return bcrypt.hash(password, bcrypt.genSaltSync(8));
    }
    static validPassword(password) {
      return bcrypt.compare(password, this.password);
    }
    static beforeCreate(user, options) {
      console.log('Pre Save Hook')
      return bcrypt.hash(user.password, 10)
        .then(hash => {
          user.password = hash
        })
        .catch (err => {
          throw new Error()
        })
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
  });
  return User;
};