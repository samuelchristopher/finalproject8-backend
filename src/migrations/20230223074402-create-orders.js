'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      total_price: {
        allowNull: false,
        type: Sequelize.DECIMAL(19, 2),
      },
      status: {
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      last_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      provinsi: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      kabkota: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      kecamatan: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      kelurahan: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      postal_code: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      address: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      phone_number: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      other_desc: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      shipping_method: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      payment_method: {
        allowNull: false,
        type: Sequelize.STRING,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  },
};
