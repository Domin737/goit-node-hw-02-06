const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contactsController");
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

router.get("/", contactsController.listContacts);

router.get("/:contactId", contactsController.getById);

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    contactsController.addContact(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", contactsController.removeContact);

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    contactsController.updateContact(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const { error } = favoriteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    contactsController.updateStatusContact(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
