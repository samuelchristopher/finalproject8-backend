'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      image_path: {
        allowNull: true,
        type: Sequelize.TEXT,
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
      'product_images', // name of source model
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_images');
  },
};
