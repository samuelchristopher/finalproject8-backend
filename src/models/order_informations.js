'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_informations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order_informations.init(
    {
      order_id: DataTypes.INTEGER,
      email: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      provinsi: DataTypes.STRING,
      kabkota: DataTypes.STRING,
      kecamatan: DataTypes.STRING,
      kelurahan: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      address: DataTypes.TEXT,
      phone_number: DataTypes.STRING,
      other_desc: DataTypes.STRING,
      shipping_method: DataTypes.STRING,
      payment_method: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'order_informations',
    }
  );
  return order_informations;
};
