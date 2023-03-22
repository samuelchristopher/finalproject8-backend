const date = require('./dateParser');

const respMsg = (endpoint, status, message, error, data) => {
  switch (endpoint) {
    case '/categories':
      return {
        timestamp: date,
        status,
        message,
        error,
        categories: data,
      };

    case '/products':
      return {
        timestamp: date,
        status,
        message,
        error,
        products: data,
      };

    case '/reviews':
      return {
        timestamp: date,
        status,
        message,
        error,
        reviews: data,
      };

    case '/orders':
      return {
        timestamp: date,
        status,
        message,
        error,
        orders: data,
      };

    default:
      return {
        timestamp: date,
        status,
        message,
        error,
        data,
      };
  }
};

module.exports = respMsg;
