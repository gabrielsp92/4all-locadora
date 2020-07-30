'use strict';

const bcrypt = require('bcrypt')

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
    const hash = await bcrypt.hash('adminadmin', bcrypt.genSaltSync(8));
    const hash2 = await bcrypt.hash('clientclient', bcrypt.genSaltSync(8));
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Client',
        email: 'client@client.com',
        password: hash2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin',
        email: 'admin@admin.com',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    return queryInterface.bulkInsert('UserRoles', [
      {
        userId: 1, // User Id
        roleId: 1, // Default Role ID
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
    return queryInterface.bulkDelete('UserRoles', null, {});
  }
};
