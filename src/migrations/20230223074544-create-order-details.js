'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      qty: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      price: {
        allowNull: false,
        type: Sequelize.DECIMAL(19, 2),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addColumn(
      'order_details', // name of source model
      'product_id', // name of the key we're adding
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        after: 'id', // add column after specific field
        references: {
          model: 'products', // name of target model
          key: 'id', // key in target model that we're referencing
        },
      }
    );
    await queryInterface.addColumn(
      'order_details', // name of source model
      'order_id', // name of the key we're adding
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        after: 'id', // add column after specific field
        references: {
          model: 'orders', // name of target model
          key: 'id', // key in target model that we're referencing
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_details');
  },
};
