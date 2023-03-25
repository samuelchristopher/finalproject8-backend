const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../models');
const respMsg = require('../helpers/respMsg');
const respCode = require('../helpers/respCode');

exports.register = async (req, res, next) => {
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

    if (payload.username == null || payload.password == null) {
      return res
        .status(respCode.BAD_REQUEST)
        .send(
          respMsg(
            req.baseUrl,
            respCode.BAD_REQUEST,
            'Register Failed, Please Ensure Payload Valid',
            null,
            null
          )
        );
    }

    const hashedPass = bcrypt.hashSync(payload.password, 8);
    // console.log('object: >>', hashedPass);

    const checkUsername = await users.findAndCountAll({
      where: {
        username: payload.username,
      },
    });
    // console.log(checkUsername);

    if (checkUsername.rows != 0) {
      return res
        .status(respCode.CONFLICT)
        .send(
          respMsg(
            req.baseUrl,
            respCode.CONFLICT,
            'Username Already Exist',
            null,
            null
          )
        );
    }

    const registerUser = await users.create({
      // firstname: payload.firstname,
      // lastname: payload.lastname,
      username: payload.username,
      // email: payload.email,
      password: hashedPass,
    });

    const getRegisteredUser = await users.findOne({
      attributes: ['id', 'username'],
      where: { id: registerUser.id },
    });

    return res
      .status(respCode.CREATED)
      .send(
        respMsg(
          req.baseUrl,
          respCode.CREATED,
          'New User Created',
          null,
          getRegisteredUser
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

exports.login = async (req, res, next) => {
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

    if (payload.username == null || payload.password == null) {
      return res
        .status(respCode.BAD_REQUEST)
        .send(
          respMsg(
            req.baseUrl,
            respCode.BAD_REQUEST,
            'Login Failed, Please Ensure Payload Valid',
            null,
            null
          )
        );
    }

    const getUser = await users.findOne({
      where: { username: payload.username },
    });
    // console.log('object: >>', getUser);

    if (getUser !== null) {
      const comparedPassword = bcrypt.compareSync(
        payload.password,
        getUser.dataValues.password
      );
      // console.log('object: >>', comparedPassword);

      if (comparedPassword === false) {
        return res
          .status(respCode.BAD_REQUEST)
          .send(
            respMsg(
              req.baseUrl,
              respCode.BAD_REQUEST,
              'Invalid Password',
              null,
              null
            )
          );
      }
      const token = jwt.sign(
        {
          id: getUser.dataValues.id,
          username: getUser.dataValues.username,
        },
        process.env.JWT_KEY,
        { expiresIn: 3600 }
      );

      return res
        .status(respCode.OK)
        .send(respMsg(req.baseUrl, respCode.OK, 'Login Success', null, token));
    }
    return res
      .status(respCode.NOT_FOUND)
      .send(
        respMsg(
          req.baseUrl,
          respCode.NOT_FOUND,
          'Username not Registered',
          null,
          null
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
