require('dotenv').config();
const respMsg = require('./respMsg');
const respCode = require('./respCode');

const jwt = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {
  try {
    const jwtToken = req.headers.authorization;
    if (!jwtToken) {
      return res
        .status(respCode.FORBIDDEN)
        .send(
          respMsg(
            req.baseUrl,
            respCode.FORBIDDEN,
            'No JWT Token Provided',
            null,
            null
          )
        );
    }

    const verify = jwt.verify(jwtToken.split(' ')[1], process.env.JWT_KEY);
    if (!verify) {
      return res
        .status(respCode.FORBIDDEN)
        .send(
          respMsg(
            req.baseUrl,
            respCode.FORBIDDEN,
            'Failed to authenticate JWT TOKEN',
            null,
            null
          )
        );
    }

    req.user = verify;
    next();
  } catch (error) {
    res.status(500).send({
      code: 500,
      status: false,
      message: error.message,
      data: null,
    });
  }
};
