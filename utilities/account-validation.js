const utilities = require("../utilities/index")
const express = require("express-validator");
const utility = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
const accountModel = require("../models/account-model");


// Login Validation Rules
validate.loginRules = () => {
  return [
      body("account_email")
          .trim()
          .escape()
          .notEmpty()
          .isEmail()
          .normalizeEmail()
          .withMessage("Please provide a valid email address."),

      body("account_password")
          .trim()
          .notEmpty()
          .withMessage("Password is required."),
  ];
};

validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body;
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
      res.render("account/login", {
          errors: errors.array(),
          title: "Login",
          account_email,
      });
      return;
  }

  const account = await accountModel.getAccountByEmail(account_email);
  if (!account) {
      errors.push({ msg: "Invalid email or password." });
      res.render("account/login", {
          errors: errors,
          title: "Login",
          account_email,
      });
      return;
  }

  const passwordMatch = await bcrypt.compare(account_password, account.account_password);
  if (!passwordMatch) {
      errors.push({ msg: "Invalid email or password." });
      res.render("account/login", {
          errors: errors,
          title: "Login",
          account_email,
      });
      return;
  }

  next();
};





/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utility.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }
  
  module.exports = validate