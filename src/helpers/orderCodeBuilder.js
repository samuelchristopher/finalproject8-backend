const d = new Date();
const year = d.getFullYear().toString().substring(2).padStart(2, '0');
const month = d.getMonth() + 1;
const date = d.getDate().toString().padStart(2, '0');
// const dateNow = Date.now();

const orderCodeBuilder = year
  .toString()
  .concat(month.toString().padStart(2, '0'), date);

module.exports = orderCodeBuilder;
