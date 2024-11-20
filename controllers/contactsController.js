const mongoose = require("mongoose");
const Contact = require("../models/contacts");
const Joi = require("joi");
const { handleAsync } = require("../utils/asyncHandler");
const { NotFoundError, BadRequestError } = require("../utils/errors");

// Funkcja do walidacji ObjectId
const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const validateContactBody = (body) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
  });

  return schema.validate(body);
};

const listContacts = handleAsync(async (req, res) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const filter = { owner: req.user._id };
  if (favorite !== undefined) {
    filter.favorite = favorite === "true";
  }

  const contacts = await Contact.find(filter).skip(skip).limit(parseInt(limit));

  res.status(200).json(contacts);
});

const getById = handleAsync(async (req, res) => {
  const { contactId } = req.params;

  if (!validateObjectId(contactId)) {
    throw new BadRequestError("Invalid contact ID");
  }

  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw new NotFoundError("Not found");
  }
  res.status(200).json(contact);
});

const addContact = handleAsync(async (req, res) => {
  const { error } = validateContactBody(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(newContact);
});

const removeContact = handleAsync(async (req, res) => {
  const { contactId } = req.params;

  if (!validateObjectId(contactId)) {
    throw new BadRequestError("Invalid contact ID");
  }

  const contact = await Contact.findByIdAndDelete(contactId);
  if (!contact) {
    throw new NotFoundError("Not found");
  }
  res.status(200).json({ message: "Contact deleted" });
});

const updateContact = handleAsync(async (req, res) => {
  const { contactId } = req.params;

  if (!validateObjectId(contactId)) {
    throw new BadRequestError("Invalid contact ID");
  }

  const { error } = validateContactBody(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!updatedContact) {
    throw new NotFoundError("Not found");
  }
  res.status(200).json(updatedContact);
});

const updateStatusContact = handleAsync(async (req, res) => {
  const { contactId } = req.params;

  if (!validateObjectId(contactId)) {
    throw new BadRequestError("Invalid contact ID");
  }

  const { error } = validateFavoriteStatus(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite: req.body.favorite },
    { new: true }
  );
  if (!updatedContact) {
    throw new NotFoundError("Not found");
  }
  res.status(200).json(updatedContact);
});

module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
