const mongoose = require('mongoose');

//------------ Address Schema ------------//
const AddressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;