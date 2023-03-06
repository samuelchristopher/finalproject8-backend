const { products, categories } = require('../models');
const respMsg = require('../helpers/respMsg');
const respCode = require('../helpers/respCode');
const { Op } = require('sequelize');

exports.addProduct = async (req, res, next) => {
  try {
    const payload = req.body;
    // console.log('object: >>', payload);
    if (Object.keys(payload).length === 0) {
      return res
        .status(respCode.BAD_REQUEST)
        .send(
          respMsg(
            respCode.BAD_REQUEST,
            'Body is Required, Cannot be Empty',
            null,
            null
          )
        );
    }

    switch (true) {
      case payload.categoryID == null:
      case payload.sku == null:
      case payload.productName == null:
      case payload.productDesc == null:
      case payload.productPrice == null:
      case payload.productStock == null:
        return res
          .status(respCode.BAD_REQUEST)
          .send(
            respMsg(
              respCode.BAD_REQUEST,
              'Insert Failed, Please Ensure Payload Valid',
              null,
              null
            )
          );

      default:
        break;
    }

    const checkCategoryById = await categories.findOne({
      where: { id: payload.categoryID },
    });
    // console.log(checkCategoryById);

    if (!checkCategoryById) {
      return res
        .status(respCode.NOT_FOUND)
        .send(respMsg(respCode.NOT_FOUND, 'Category ID Not Found', null, null));
    }

    const checkProducts = await products.findAndCountAll({
      where: {
        sku: payload.sku,
      },
    });
    console.log(checkProducts);

    if (checkProducts.rows != 0) {
      return res
        .status(respCode.CONFLICT)
        .send(
          respMsg(respCode.CONFLICT, 'SKU Product Already Exist', null, null)
        );
    }

    const insertProduct = await products.create({
      category_id: payload.categoryID,
      sku: payload.sku,
      name: payload.productName,
      desc: payload.productDesc,
      price: payload.productPrice,
      stock: payload.productStock,
    });
    // console.log('insertProduct: ' + JSON.stringify(insertProduct));
    // console.log('id: ' + insertProduct.id);

    const getInsertedProduct = await products.findOne({
      include: {
        model: categories,
        required: true,
        attributes: ['id', 'name'],
      },
      where: { id: insertProduct.id },
    });

    return res
      .status(respCode.CREATED)
      .send(
        respMsg(
          respCode.CREATED,
          'New Product Created',
          null,
          getInsertedProduct
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(respCode.SERVER_ERROR)
      .send(
        respMsg(
          respCode.SERVER_ERROR,
          'Oops, Something Wrong Happened',
          error,
          null
        )
      );
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const getAllData = await products.findAll({
      // attributes: ['id', 'sku', 'name', ''],
      include: {
        model: categories,
        required: true,
        attributes: ['id', 'name'],
      },
    });

    return res
      .status(respCode.OK)
      .send(
        respMsg(respCode.OK, 'Retrieve All Data Successfully', null, getAllData)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(respCode.SERVER_ERROR)
      .send(
        respMsg(
          respCode.SERVER_ERROR,
          'Oops, Something Wrong Happened',
          error,
          null
        )
      );
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const data = await products.findOne({
      include: {
        model: categories,
        required: true,
        attributes: ['id', 'name'],
      },
      where: { id: req.params.id },
    });
    // console.log(typeof data);
    if (data !== null) {
      return res
        .status(respCode.OK)
        .send(
          respMsg(
            respCode.OK,
            'Retrieve Data by ID Successfully',
            null,
            data.dataValues
          )
        );
    }

    return res
      .status(respCode.NOT_FOUND)
      .send(respMsg(respCode.NOT_FOUND, 'ID Not Found', null, null));
  } catch (error) {
    console.error(error);
    return res
      .status(respCode.SERVER_ERROR)
      .send(
        respMsg(
          respCode.SERVER_ERROR,
          'Oops, Something Wrong Happened',
          error,
          null
        )
      );
  }
};

exports.updateProductById = async (req, res, next) => {
  try {
    const payload = req.body;
    if (Object.keys(payload).length === 0) {
      return res
        .status(respCode.BAD_REQUEST)
        .send(
          respMsg(
            respCode.BAD_REQUEST,
            'Body is Required, Cannot be Empty',
            null,
            null
          )
        );
    }

    switch (true) {
      case payload.categoryID == null:
      case payload.sku == null:
      case payload.productName == null:
      case payload.productDesc == null:
      case payload.productPrice == null:
      case payload.productStock == null:
        return res
          .status(respCode.BAD_REQUEST)
          .send(
            respMsg(
              respCode.BAD_REQUEST,
              'Update Failed, Please Ensure Payload Valid',
              null,
              null
            )
          );

      default:
        break;
    }

    const checkProductById = await products.findOne({
      where: { id: req.params.id },
    });
    // console.log(checkProductById);
    if (checkProductById !== null) {
      if (payload.categoryID != null) {
        const checkCategoryById = await categories.findOne({
          where: { id: payload.categoryID },
        });
        // console.log(checkCategoryById);

        if (!checkCategoryById) {
          return res
            .status(respCode.NOT_FOUND)
            .send(
              respMsg(respCode.NOT_FOUND, 'Category ID Not Found', null, null)
            );
        }
      }

      if (payload.sku != null) {
        const checkSKU = await products.findOne({
          where: {
            [Op.and]: [{ sku: payload.sku }, { id: req.params.id }],
          },
        });

        if (!checkSKU) {
          return res
            .status(respCode.CONFLICT)
            .send(
              respMsg(respCode.CONFLICT, 'SKU Already Registered', null, null)
            );
        }
      }

      await products.update(
        {
          category_id: payload.categoryID,
          sku: payload.sku,
          name: payload.productName,
          desc: payload.productDesc,
          price: payload.productPrice,
          stock: payload.productStock,
        },
        {
          where: { id: req.params.id },
        }
      );

      const updateResp = await products.findOne({
        include: {
          model: categories,
          required: true,
          attributes: ['id', 'name'],
        },
        where: { id: req.params.id },
      });

      return res
        .status(respCode.OK)
        .send(
          respMsg(
            respCode.OK,
            'Update data by ID successfully',
            null,
            updateResp
          )
        );
    }
    return res
      .status(respCode.NOT_FOUND)
      .send(respMsg(respCode.NOT_FOUND, 'ID Not Found', null, null));
  } catch (error) {
    console.error(error);
    return res
      .status(respCode.SERVER_ERROR)
      .send(
        respMsg(
          respCode.SERVER_ERROR,
          'Oops, Something Wrong Happened',
          error,
          null
        )
      );
  }
};

exports.deleteProductById = async (req, res, next) => {
  try {
    const checkProductById = await products.findOne({
      where: { id: req.params.id },
    });
    // console.log(checkProductById);
    if (checkProductById !== null) {
      await products.destroy({
        where: { id: req.params.id },
      });
      return res
        .status(respCode.OK)
        .send(
          respMsg(respCode.OK, 'Delete data by ID successfully', null, null)
        );
    }
    return res
      .status(respCode.NOT_FOUND)
      .send(respMsg(respCode.NOT_FOUND, 'ID Not Found', null, null));
  } catch (error) {
    console.error(error);
    return res
      .status(respCode.SERVER_ERROR)
      .send(
        respMsg(
          respCode.SERVER_ERROR,
          'Oops, Something Wrong Happened',
          error,
          null
        )
      );
  }
};
