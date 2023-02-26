'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      review_name: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: 'Anonymous',
      },
      review_email: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: 'anon@mail.com',
      },
      review_stars: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      review_title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      review_desc: {
        allowNull: false,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reviews');
  },
};
