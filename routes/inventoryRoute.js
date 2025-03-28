// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation");




// Route to management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to add classification process
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to add inventory process
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);




// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to build inventory item detail view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildInventoryDetail))

// Route for intentional 500 error
router.get("/intentional-error", utilities.handleErrors(invController.triggerServerError));



module.exports = router;