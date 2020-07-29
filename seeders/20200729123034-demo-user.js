'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    // return queryInterface.bulkInsert('Users', [{
    //   name: 'Admin',
    //   email: 'admin@admin.com',
    //   password: 'adminadmin',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }]);
    return Sequelize.models.User.create({
      name: 'admin',
      email: 'admin@admin.com',
      password: 'adminadmin',
      name: 'admin',
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
