const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;
const date = d.getDate();
const dateNow = Date.now();

const orderCodeBuilder = year.toString().concat(month, date, dateNow);

module.exports = orderCodeBuilder;
