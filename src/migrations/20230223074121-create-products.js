'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sku: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      desc: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      price: {
        allowNull: false,
        type: Sequelize.DECIMAL(19, 2),
      },
      stock: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addColumn(
      'products', // name of source model
      'category_id', // name of the key we're adding
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        after: 'id', // add column after specific field
        references: {
          model: 'categories', // name of target model
          key: 'id', // key in target model that we're referencing
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  },
};
