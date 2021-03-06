'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
    */
   return queryInterface.bulkInsert('Movies', [
    {
      title: 'Pulp Fiction',
      director: 'Quentin Tarantino',
      quantity: 2,
      quantityAvailable: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Lord Of The Rings Trilogy',
      director: 'Peter Jackson',
      quantity: 1,
      quantityAvailable: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Midsommar',
      director: 'Ari Aster',
      quantity: 3,
      quantityAvailable: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Movies', null, {});
  }
};
