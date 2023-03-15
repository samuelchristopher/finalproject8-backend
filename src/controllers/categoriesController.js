const { categories, products } = require('../models');
const respMsg = require('../helpers/respMsg');
const respCode = require('../helpers/respCode');

exports.addCategory = async (req, res, next) => {
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

    if (payload.categoryName == null) {
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
    }

    const checkCategory = await categories.findAndCountAll({
      where: {
        name: payload.categoryName,
      },
    });
    // console.log(checkCategory);

    if (checkCategory.rows != 0) {
      return res
        .status(respCode.CONFLICT)
        .send(respMsg(respCode.CONFLICT, 'Category Already Exist', null, null));
    }

    const insertCategory = await categories.create({
      name: payload.categoryName,
    });

    // console.log('id: ' + JSON.stringify(insertCategory));

    const getInsertedCategory = await categories.findOne({
      attributes: ['id', 'name'],
      where: { id: insertCategory.id },
    });

    return res
      .status(respCode.CREATED)
      .send(
        respMsg(
          respCode.CREATED,
          'New Category Created',
          null,
          getInsertedCategory
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

exports.getCategories = async (req, res, next) => {
  try {
    const getAllData = await categories.findAll({
      attributes: ['id', 'name'],
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

exports.getCategoryById = async (req, res, next) => {
  try {
    const data = await categories.findOne({
      attributes: ['id', 'name'],
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

exports.updateCategoryById = async (req, res, next) => {
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

    const checkCategoryById = await categories.findOne({
      where: { id: req.params.id },
    });
    // console.log(checkCategoryById);
    if (checkCategoryById !== null) {
      const updateCategory = await categories.update(
        {
          name: payload.categoryName,
        },
        {
          where: { id: req.params.id },
        }
      );

      if (updateCategory[0] === 0) {
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
      }

      const updateResp = await categories.findOne({
        attributes: ['id', 'name'],
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

exports.deleteCategoryById = async (req, res, next) => {
  try {
    const checkCategoryById = await categories.findOne({
      where: { id: req.params.id },
    });
    // console.log(checkCategoryById);
    if (checkCategoryById !== null) {
      const checkActiveProducts = await products.findAndCountAll({
        where: { category_id: req.params.id },
      });

      if (checkActiveProducts.rows != 0) {
        return res
          .status(respCode.BAD_REQUEST)
          .send(
            respMsg(
              respCode.BAD_REQUEST,
              'Cannot Delete Category, Product(s) Still Active',
              null,
              null
            )
          );
      }

      await categories.destroy({
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
