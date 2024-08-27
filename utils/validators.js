const Joi = require("joi");
const mongoose = require("mongoose");

const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid ID format");
    error.status = 400;
    throw error;
  }
};

const validateUserSignup = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const validateContactData = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  });
  return schema.validate(data);
};

const validateFavoriteStatus = (data) => {
  const schema = Joi.object({
    favorite: Joi.boolean().required(),
  });
  return schema.validate(data);
};

module.exports = {
  validateObjectId,
  validateUserSignup,
  validateContactData,
  validateFavoriteStatus,
};
