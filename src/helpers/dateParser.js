const IDFormatDate = new Date(Date.now()).toLocaleString('id-ID', {
  dateStyle: 'short',
  timeStyle: 'long',
});

module.exports = IDFormatDate;
