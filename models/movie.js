'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Movie.init({
    title: DataTypes.STRING,
    director: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    quantityAvailable: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Movie',
    hooks: {
      beforeCreate: async (user, options) => {
        user.quantityAvailable = user.quantity
      },
    }
  });
  return Movie;
};