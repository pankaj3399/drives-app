const OrderModel = require('../models/order')

const generateAuthCode = async () => {
  const randomPart = Math.floor(Math.random() * 90000000) + 10000000;
  const order = await OrderModel.findOne({ authCode: randomPart }).lean();

  if (order) {
    return generateAuthCode();
  }
  return randomPart.toString();
};

module.exports = generateAuthCode;