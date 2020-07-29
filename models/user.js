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
    static async authenticateByEmailAndPassword(email, password) {
      const user = await this.findOne({email})
      if (!user) throw new  Error('User not found')
      if (await this.validatePassword(password, user.password)){
        console.log('User Authenticated')
        return user
      }
      throw new Error('Wrong Password')
    }
    static async validatePassword(password, hash) {
      console.log({ password, hash })
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
      }
    }
  });
  return User;
};