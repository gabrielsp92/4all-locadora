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
      this.belongsTo(models.Category)
      this.belongsToMany(models.User, {
        through: 'Rent',
        as: 'rents',
        foreignKey: 'movieId',
        otherKey: 'userId'
      });
    }
  };
  Movie.init({
    title: DataTypes.STRING,
    director: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    quantityBeingRent: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};