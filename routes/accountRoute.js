// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities")
const accountController = require("../controllers/accountController.js");
const regValidate = require('../utilities/account-validation')

// Route to handle "My Account" link click
router.get("/", utilities.handleErrors(accountController.buildLogin));

// Login POST route (validation and processing)
router.post(
    "/login",
    regValidate.loginRules(), // Apply login validation rules
    regValidate.checkLoginData, // Check login data
    utilities.handleErrors(accountController.loginAccount) // Process the login
  );

// Deliver Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// register post route
router.post('/register', 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

module.exports = router;