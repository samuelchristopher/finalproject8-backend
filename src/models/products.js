'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.product_images, {
        foreignKey: 'product_id',
      });
      this.hasMany(models.reviews, {
        foreignKey: 'product_id',
      });
      this.hasMany(models.order_details, {
        foreignKey: 'product_id',
      });
      this.belongsTo(models.categories, {
        foreignKey: 'category_id',
      });
    }
  }
  products.init(
    {
      sku: DataTypes.STRING,
      name: DataTypes.STRING,
      desc: DataTypes.TEXT,
      price: DataTypes.DECIMAL,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'products',
      paranoid: true,
      timestamps: true,
    }
  );
  return products;
};
