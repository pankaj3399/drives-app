const Joi = require('joi');
const HardDriveDeletionStatusEnum = require('../models/enum');
const HardDriveDeletionStatusArray = Object.values(HardDriveDeletionStatusEnum);

const customerValidation = ({ company, name, address, email }) => {
  const schema = Joi.object().keys({
    company: Joi.string().required().messages({
      "string.base": `company should be a type of String`,
      "string.empty": `company cannot be an empty field`,
      "any.required": `company is required.`,
    }),
    name: Joi.string().required().messages({
      "string.base": `name should be a type of String`,
      "string.empty": `name cannot be an empty field`,
      "any.required": `name is required.`,
    }),
    address: Joi.string().required().messages({
      "string.base": `address should be a type of String`,
      "string.empty": `address cannot be an empty field`,
      "any.required": `address is required.`,
    }),
    email: Joi.string().email().required().messages({
      "string.base": `email should be a type of String`,
      "string.empty": `email cannot be an empty field`,
      "string.email": `Please enter a correct email address`,
      "any.required": `email is required.`,
    }),
  });

  const { value, error } = schema.validate({ company, name, address, email }, { escapeHtml: true });
  return { value, error };
};

const getQueryCustomersValidation = ({ customerId, page, limit }) => {
  const schema = Joi.object().keys({
    customerId: Joi.string().optional().regex(/^[0-9a-fA-F]{24}$/).messages({
      "string.base": `customerId should be a type of String`,
      "string.pattern.base": `Invalid customerId format`,
    }),
    page: Joi.number().integer().min(1).required().messages({
      "number.base": `page should be a type of Number`,
      "number.integer": `page should be an integer`,
      "number.min": `page should be greater than or equal to 1`,
      "any.required": `page is required.`,
    }),
    limit: Joi.number().integer().optional().min(1).max(100).messages({
      "number.base": `limit should be a type of Number`,
      "number.integer": `limit should be an integer`,
      "number.min": `limit should be greater than or equal to 1`,
      "number.max": `limit should be less than or equal to 100`,
    }),
  });

  const { value, error } = schema.validate({ customerId, page, limit }, { escapeHtml: true });
  return { value, error };
};

const orderValidation = ({ customerId, devices, collectionDate }) => {
  const schema = Joi.object().keys({
    customerId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
      "string.base": `customerId should be a type of String`,
      "any.required": `customerId is required.`,
      "string.pattern.base": `Invalid customerId format`,
    }),
    devices: Joi.number().required().messages({
      "number.base": `devices should be a type of Number`,
      "any.required": `devices is required.`,
    }),
    collectionDate: Joi.date().required().messages({
      "date.base": `collectionDate should be a type of Date`,
      "any.required": `collectionDate is required.`,
    }),
  });

  const { value, error } = schema.validate({ customerId, devices, collectionDate }, { escapeHtml: true });
  return { value, error };
};

const updateOrderValidation = ({ devices, collectionDate, completionDate }) => {
  const schema = Joi.object().keys({
    devices: Joi.number().messages({
      "number.base": `devices should be a type of Number`,
    }),
    collectionDate: Joi.date().messages({
      "date.base": `collectionDate should be a type of Date`,
    }),
    completionDate: Joi.date().allow(null).messages({
      "date.base": `completionDate should be a type of Date`,
    }),
  });

  const { value, error } = schema.validate({ devices, collectionDate, completionDate }, { escapeHtml: true });
  return { value, error };
};

const getQueryOrdersValidation = ({ orderId, customerId, page, limit }) => {
  const schema = Joi.object().keys({
    orderId: Joi.string().optional().regex(/^[0-9a-fA-F]{24}$/).messages({
      "string.base": `orderId should be a type of String`,
      "string.pattern.base": `Invalid orderId format`,
    }),
    customerId: Joi.string().optional().regex(/^[0-9a-fA-F]{24}$/).messages({
      "string.base": `customerId should be a type of String`,
      "string.pattern.base": `Invalid customerId format`,
    }),
    page: Joi.number().integer().min(1).required().messages({
      "number.base": `page should be a type of Number`,
      "number.integer": `page should be an integer`,
      "number.min": `page should be greater than or equal to 1`,
      "any.required": `page is required.`,
    }),
    limit: Joi.number().integer().optional().min(1).max(100).messages({
      "number.base": `limit should be a type of Number`,
      "number.integer": `limit should be an integer`,
      "number.min": `limit should be greater than or equal to 1`,
      "number.max": `limit should be less than or equal to 100`,
    }),
  });

  const { value, error } = schema.validate({ orderId, customerId, page, limit }, { escapeHtml: true });
  return { value, error };
};

const scanValidation = ({ customerId, orderId, serialNumber }) => {
  const schema = Joi.object().keys({
    customerId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
      "string.base": `customerId should be a type of String`,
      "any.required": `customerId is required.`,
      "string.pattern.base": `Invalid customerId format`,
    }),
    orderId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
      "string.base": `orderId should be a type of String`,
      "any.required": `orderId is required.`,
      "string.pattern.base": `Invalid orderId format`,
    }),
    serialNumber: Joi.string().required().messages({
      "string.base": `serialNumber should be a type of String`,
      "any.required": `serialNumber is required.`,
    }),
  });

  const { value, error } = schema.validate({ customerId, orderId, serialNumber }, { escapeHtml: true });
  return { value, error };
};

const updateScanValidation = ({ scanId, status }) => {
  const schema = Joi.object().keys({
    scanId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
      "string.base": `scanId should be a type of String`,
      "any.required": `scanId is required.`,
      "string.pattern.base": `Invalid scanId format`,
    }),
    status: Joi.string().required().valid(...HardDriveDeletionStatusArray).messages({
      "string.base": `status should be a type of String`,
      "any.required": `status is required.`,
      "any.only": `Invalid paymentMethod. Allowed values: ${HardDriveDeletionStatusArray.join(', ')}`,
    }),
  });

  const { value, error } = schema.validate({ scanId, status }, { escapeHtml: true });
  return { value, error };
};


module.exports = {
  customerValidation,
  scanValidation,
  getQueryOrdersValidation,
  orderValidation,
  getQueryCustomersValidation,
  updateOrderValidation,
  updateScanValidation
};