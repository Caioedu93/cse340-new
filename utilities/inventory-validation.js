const { body, validationResult } = require("express-validator");
const utilities = require("./index");
const validate = {};

// Classification rules
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name must not contain spaces or special characters."),
  ];
};

// Check classification data
validate.checkClassificationData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
    });
    return;
  }
  next();
};

// Inventory rules
validate.inventoryRules = () => {
    return [
      body("inv_make").trim().escape().notEmpty().isLength({ min: 3 }).withMessage("Make must be at least 3 characters."),
      body("inv_model").trim().escape().notEmpty().isLength({ min: 3 }).withMessage("Model must be at least 3 characters."),
      body("inv_year").trim().escape().notEmpty().isInt({ min: 1000, max: 9999 }).withMessage("Year must be 4 digits."),
      body("inv_description").trim().escape().notEmpty().withMessage("Description is required."),
      body("inv_image").trim().escape().notEmpty().withMessage("Image path is required."),
      body("inv_thumbnail").trim().escape().notEmpty().withMessage("Thumbnail path is required."),
      body("inv_price").trim().escape().notEmpty().isFloat().withMessage("Price is required."),
      body("inv_miles").trim().escape().notEmpty().isInt().withMessage("Miles is required."),
      body("inv_color").trim().escape().notEmpty().withMessage("Color is required."),
      body("classification_id").trim().escape().notEmpty().isInt().withMessage("Classification is required."),
    ];
  };

// Check inventory data
validate.checkInventoryData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(req.body.classification_id);
    res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body,
    });
    return;
  }
  next();
};

module.exports = validate;