const { Op } = require('sequelize');
const { orders, order_details, products, sequelize } = require('../models');
const respMsg = require('../helpers/respMsg');
const respCode = require('../helpers/respCode');
const orderCode = require('../helpers/orderCodeBuilder');

exports.addOrder = async (req, res, next) => {
  let transaction;
  try {
    const payload = req.body;
    // console.log('object: >>', payload);
    if (Object.keys(payload).length === 0) {
      return res
        .status(respCode.BAD_REQUEST)
        .send(
          respMsg(
            req.baseUrl,
            respCode.BAD_REQUEST,
            'Body is Required, Cannot be Empty',
            null,
            null
          )
        );
    }

    switch (true) {
      case payload.orderTotalPrice == null:
      case payload.orderEmail == null:
      case payload.orderFirstName == null:
      case payload.orderProvinsi == null:
      case payload.orderKabkota == null:
      case payload.orderKecamatan == null:
      case payload.orderKelurahan == null:
      case payload.orderAddress == null:
      case payload.orderPhoneNumber == null:
      case payload.orderShippingMethod == null:
      case payload.orderPaymentMethod == null:
      case payload.orderDetails == null:
        return res
          .status(respCode.BAD_REQUEST)
          .send(
            respMsg(
              req.baseUrl,
              respCode.BAD_REQUEST,
              'Insert Failed, Please Ensure Payload Valid',
              null,
              null
            )
          );

      default:
        break;
    }

    // const checkProductById = await products.findOne({
    //   where: { id: payload.orderDetailProductID },
    // });
    // // console.log(checkProductById);

    // if (!checkProductById) {
    //   return res
    //     .status(respCode.NOT_FOUND)
    //     .send(respMsg(req.baseUrl,respCode.NOT_FOUND, 'Product ID Not Found', null, null));
    // }

    const rndInt = Math.floor(Math.random() * (9999 - 1 + 1)) + 1;
    const leadZeroRndInt = `0000${rndInt}`.slice(-4);
    const dateNow = Date.now();

    transaction = await sequelize.transaction();

    const insertOrder = await orders.create(
      {
        order_code: orderCode.toString().concat(dateNow, leadZeroRndInt),
        total_price: payload.orderTotalPrice,
        status: 'CREATED',
        email: payload.orderEmail,
        first_name: payload.orderFirstName,
        last_name: payload.orderLastName,
        provinsi: payload.orderProvinsi,
        kabkota: payload.orderKabkota,
        kecamatan: payload.orderKecamatan,
        kelurahan: payload.orderKelurahan,
        postal_code: payload.orderPostalCode,
        address: payload.orderAddress,
        phone_number: payload.orderPhoneNumber,
        other_desc: payload.orderOtherDesc,
        shipping_method: payload.orderShippingMethod,
        payment_method: payload.orderPaymentMethod,
      },
      { transaction }
    );

    const dataOrderDetails = [];

    payload.orderDetails.forEach((details) => {
      const data = {
        order_id: insertOrder.id,
        product_id: details.productID,
        qty: details.qty,
        price: details.price,
      };

      dataOrderDetails.push(data);
    });

    await order_details.bulkCreate(dataOrderDetails, { transaction });

    for (const details of dataOrderDetails) {
      const checkProductById = await products.findOne({
        where: { id: details.product_id },
      });
      if (checkProductById.stock <= 0) {
        transaction.rollback();
        return res
          .status(respCode.BAD_REQUEST)
          .send(
            respMsg(
              req.baseUrl,
              respCode.BAD_REQUEST,
              'Insert Failed, Out Of Stock',
              null,
              null
            )
          );
      }
      if (details.qty > checkProductById.stock) {
        transaction.rollback();
        return res
          .status(respCode.BAD_REQUEST)
          .send(
            respMsg(
              req.baseUrl,
              respCode.BAD_REQUEST,
              'Insert Failed, Order Qty cannot Larger than Stock',
              null,
              null
            )
          );
      }
      products.decrement(
        { stock: details.qty },
        { where: { id: details.product_id } },
        { transaction }
      );
    }

    await transaction.commit();

    // console.log('insertReview: ' + JSON.stringify(insertReview));
    // console.log('id: ' + insertReview.id);

    const getInsertedOrder = await orders.findOne({
      attributes: [
        'id',
        'order_code',
        'total_price',
        'status',
        'email',
        'first_name',
        'last_name',
        'provinsi',
        'kabkota',
        'kecamatan',
        'kelurahan',
        'postal_code',
        'address',
        'phone_number',
        'other_desc',
        'shipping_method',
        'payment_method',
      ],
      include: {
        model: order_details,
        required: true,
        attributes: ['id', 'qty', 'price'],
        include: {
          model: products,
          required: true,
          attributes: ['id', 'name'],
        },
      },
      where: { id: insertOrder.id },
    });

    return res
      .status(respCode.CREATED)
      .send(
        respMsg(
          req.baseUrl,
          respCode.CREATED,
          'New Order Created',
          null,
          getInsertedOrder
        )
      );
  } catch (error) {
    console.error(error);
    if (transaction) {
      await transaction.rollback();
    }
    return res
      .status(respCode.SERVER_ERROR)
      .send(
        respMsg(
          req.baseUrl,
          respCode.SERVER_ERROR,
          'Oops, Something Wrong Happened',
          error,
          null
        )
      );
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const getAllData = await orders.findAll({
      attributes: [
        'id',
        'order_code',
        'total_price',
        'status',
        'email',
        'first_name',
        'last_name',
        'provinsi',
        'kabkota',
        'kecamatan',
        'kelurahan',
        'postal_code',
        'address',
        'phone_number',
        'other_desc',
        'shipping_method',
        'payment_method',
      ],
      include: {
        model: order_details,
        required: true,
        attributes: ['id', 'qty', 'price'],
        include: {
          model: products,
          required: true,
          attributes: ['id', 'name'],
        },
      },
    });

    return res
      .status(respCode.OK)
      .send(
        respMsg(
          req.baseUrl,
          respCode.OK,
          'Retrieve All Data Successfully',
          null,
          getAllData
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(respCode.SERVER_ERROR)
      .send(
        respMsg(
          req.baseUrl,
          respCode.SERVER_ERROR,
          'Oops, Something Wrong Happened',
          error,
          null
        )
      );
  }
};

exports.getOrderByIdOrCode = async (req, res, next) => {
  try {
    const data = await orders.findOne({
      attributes: [
        'id',
        'order_code',
        'total_price',
        'status',
        'email',
        'first_name',
        'last_name',
        'provinsi',
        'kabkota',
        'kecamatan',
        'kelurahan',
        'postal_code',
        'address',
        'phone_number',
        'other_desc',
        'shipping_method',
        'payment_method',
      ],
      include: {
        model: order_details,
        required: true,
        attributes: ['id', 'qty', 'price'],
        include: {
          model: products,
          // required: true,
          attributes: ['id', 'name'],
        },
      },
      where: {
        [Op.or]: [
          { id: req.params.idOrCode },
          { order_code: req.params.idOrCode },
        ],
      },
    });
    // console.log(typeof data);
    if (data !== null) {
      return res
        .status(respCode.OK)
        .send(
          respMsg(
            req.baseUrl,
            respCode.OK,
            'Retrieve Data by ID Successfully',
            null,
            data.dataValues
          )
        );
    }

    return res
      .status(respCode.NOT_FOUND)
      .send(
        respMsg(req.baseUrl, respCode.NOT_FOUND, 'ID Not Found', null, null)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(respCode.SERVER_ERROR)
      .send(
        respMsg(
          req.baseUrl,
          respCode.SERVER_ERROR,
          'Oops, Something Wrong Happened',
          error,
          null
        )
      );
  }
};

exports.updateOrderStatusByIdOrCode = async (req, res, next) => {
  try {
    const payload = req.body;
    if (Object.keys(payload).length === 0) {
      return res
        .status(respCode.BAD_REQUEST)
        .send(
          respMsg(
            req.baseUrl,
            respCode.BAD_REQUEST,
            'Body is Required, Cannot be Empty',
            null,
            null
          )
        );
    }

    if (payload.orderStatus == null) {
      return res
        .status(respCode.BAD_REQUEST)
        .send(
          respMsg(
            req.baseUrl,
            respCode.BAD_REQUEST,
            'Update Failed, Please Ensure Payload Valid',
            null,
            null
          )
        );
    }

    const checkOrderByIdOrCode = await orders.findOne({
      where: {
        [Op.or]: [
          { id: req.params.idOrCode },
          { order_code: req.params.idOrCode },
        ],
      },
    });

    if (checkOrderByIdOrCode !== null) {
      if (
        checkOrderByIdOrCode.status !== 'CANCELLED' &&
        payload.orderStatus === 'CANCELLED'
      ) {
        const getOrderByIdOrCode = await orders.findOne({
          where: {
            [Op.or]: [
              { id: req.params.idOrCode },
              { order_code: req.params.idOrCode },
            ],
          },
        });

        const getOrderDetailsById = await order_details.findAll({
          where: { order_id: getOrderByIdOrCode.id },
        });

        for (const details of getOrderDetailsById) {
          products.increment(
            { stock: details.qty },
            { where: { id: details.product_id } }
          );
        }
      }
      await orders.update(
        {
          status: payload.orderStatus,
        },
        {
          where: {
            [Op.or]: [
              { id: req.params.idOrCode },
              { order_code: req.params.idOrCode },
            ],
          },
        }
      );

      const updateResp = await orders.findOne({
        attributes: [
          'id',
          'order_code',
          'total_price',
          'status',
          'email',
          'first_name',
          'last_name',
          'provinsi',
          'kabkota',
          'kecamatan',
          'kelurahan',
          'postal_code',
          'address',
          'phone_number',
          'other_desc',
          'shipping_method',
          'payment_method',
        ],
        include: {
          model: order_details,
          required: true,
          attributes: ['id', 'qty', 'price'],
          include: {
            model: products,
            // required: true,
            attributes: ['id', 'name'],
          },
        },
        where: {
          [Op.or]: [
            { id: req.params.idOrCode },
            { order_code: req.params.idOrCode },
          ],
        },
      });

      return res
        .status(respCode.OK)
        .send(
          respMsg(
            req.baseUrl,
            respCode.OK,
            'Update data by ID or Code successfully',
            null,
            updateResp
          )
        );
    }
    return res
      .status(respCode.NOT_FOUND)
      .send(
        respMsg(req.baseUrl, respCode.NOT_FOUND, 'ID Not Found', null, null)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(respCode.SERVER_ERROR)
      .send(
        respMsg(
          req.baseUrl,
          respCode.SERVER_ERROR,
          'Oops, Something Wrong Happened',
          error,
          null
        )
      );
  }
};
