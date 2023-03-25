'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.products, {
        foreignKey: 'product_id',
      });
      this.belongsTo(models.orders, {
        foreignKey: 'order_id',
      });
    }
  }
  order_details.init(
    {
      qty: DataTypes.INTEGER,
      price: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: 'order_details',
    }
  );
  return order_details;
};
