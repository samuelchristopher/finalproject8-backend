'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_images extends Model {
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
    }
  }
  product_images.init(
    {
      image_path: DataTypes.TEXT,
      image_filename: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'product_images',
      paranoid: true,
      timestamps: true,
    }
  );
  return product_images;
};
