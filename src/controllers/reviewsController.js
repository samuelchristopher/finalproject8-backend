const { reviews, products, categories } = require('../models');
const respMsg = require('../helpers/respMsg');
const respCode = require('../helpers/respCode');

exports.addReview = async (req, res, next) => {
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
      case payload.productID == null:
      case payload.reviewName == null:
      case payload.reviewEmail == null:
      case payload.reviewStars == null:
      case payload.reviewTitle == null:
      case payload.reviewDesc == null:
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

    const checkProductById = await products.findOne({
      where: { id: payload.productID },
    });
    // console.log(checkProductById);

    if (!checkProductById) {
      return res
        .status(respCode.NOT_FOUND)
        .send(respMsg(respCode.NOT_FOUND, 'Product ID Not Found', null, null));
    }

    if (payload.reviewStars < 1 || payload.reviewStars > 5) {
      return res
        .status(respCode.BAD_REQUEST)
        .send(
          respMsg(
            respCode.BAD_REQUEST,
            'Minimum Review Stars is 1, Maximum Review Stars is 5',
            null,
            null
          )
        );
    }

    const insertReview = await reviews.create({
      product_id: payload.productID,
      review_name: payload.reviewName,
      review_email: payload.reviewEmail,
      review_stars: payload.reviewStars,
      review_title: payload.reviewTitle,
      review_desc: payload.reviewDesc,
    });
    // console.log('insertReview: ' + JSON.stringify(insertReview));
    // console.log('id: ' + insertReview.id);

    const getInsertedReview = await reviews.findOne({
      attributes: [
        'id',
        'review_name',
        'review_email',
        'review_stars',
        'review_title',
        'review_desc',
      ],
      include: {
        model: products,
        required: true,
        attributes: ['id', 'sku', 'name', 'desc', 'price', 'stock'],
        include: {
          model: categories,
          required: true,
          attributes: ['id', 'name'],
        },
      },
      where: { id: insertReview.id },
    });

    return res
      .status(respCode.CREATED)
      .send(
        respMsg(respCode.CREATED, 'New Review Created', null, getInsertedReview)
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

exports.getReviews = async (req, res, next) => {
  try {
    const getAllData = await reviews.findAll({
      attributes: [
        'id',
        'review_name',
        'review_email',
        'review_stars',
        'review_title',
        'review_desc',
      ],
      include: {
        model: products,
        required: true,
        attributes: ['id', 'sku', 'name', 'desc', 'price', 'stock'],
        include: {
          model: categories,
          required: true,
          attributes: ['id', 'name'],
        },
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

exports.getReviewById = async (req, res, next) => {
  try {
    const data = await reviews.findOne({
      attributes: [
        'id',
        'review_name',
        'review_email',
        'review_stars',
        'review_title',
        'review_desc',
      ],
      include: {
        model: products,
        required: true,
        attributes: ['id', 'sku', 'name', 'desc', 'price', 'stock'],
        include: {
          model: categories,
          required: true,
          attributes: ['id', 'name'],
        },
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

exports.updateReviewById = async (req, res, next) => {
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
      case payload.productID == null:
      case payload.reviewName == null:
      case payload.reviewEmail == null:
      case payload.reviewStars == null:
      case payload.reviewTitle == null:
      case payload.reviewDesc == null:
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

    const checkReviewById = await reviews.findOne({
      where: { id: req.params.id },
    });
    // console.log(checkReviewById);
    if (checkReviewById !== null) {
      if (payload.productID != null) {
        const checkProductById = await products.findOne({
          where: { id: payload.productID },
        });
        // console.log(checkProductById);

        if (!checkProductById) {
          return res
            .status(respCode.NOT_FOUND)
            .send(
              respMsg(respCode.NOT_FOUND, 'Product ID Not Found', null, null)
            );
        }
      }

      if (payload.reviewStars < 1 || payload.reviewStars > 5) {
        return res
          .status(respCode.BAD_REQUEST)
          .send(
            respMsg(
              respCode.BAD_REQUEST,
              'Minimum Review Stars is 1, Maximum Review Stars is 5',
              null,
              null
            )
          );
      }

      await reviews.update(
        {
          product_id: payload.productID,
          review_name: payload.reviewName,
          review_email: payload.reviewEmail,
          review_stars: payload.reviewStars,
          review_title: payload.reviewTitle,
          review_desc: payload.reviewDesc,
        },
        {
          where: { id: req.params.id },
        }
      );

      const updateResp = await reviews.findOne({
        attributes: [
          'id',
          'review_name',
          'review_email',
          'review_stars',
          'review_title',
          'review_desc',
        ],
        include: {
          model: products,
          required: true,
          attributes: ['id', 'sku', 'name', 'desc', 'price', 'stock'],
          include: {
            model: categories,
            required: true,
            attributes: ['id', 'name'],
          },
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

exports.deleteReviewById = async (req, res, next) => {
  try {
    const checkReviewById = await reviews.findOne({
      where: { id: req.params.id },
    });
    // console.log(checkReviewById);
    if (checkReviewById !== null) {
      await reviews.destroy({
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
