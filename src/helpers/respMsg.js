const date = require('./dateParser');

const respMsg = (status, message, error, data) => {
  return {
    timestamp: date,
    status,
    message,
    error,
    data,
  };
};

module.exports = respMsg;
