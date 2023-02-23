'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  reviews.init({
    product_id: DataTypes.INTEGER,
    review_name: DataTypes.STRING,
    review_email: DataTypes.STRING,
    review_stars: DataTypes.INTEGER,
    review_title: DataTypes.STRING,
    review_desc: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'reviews',
    paranoid: true, 
    timestamps: true,
  });
  return reviews;
};