const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * Build inventory item detail view
 * ************************** */
invCont.buildInventoryDetail = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const vehicle = await invModel.getInventoryById(inv_id)
  let nav = await utilities.getNav()
  const detail = await utilities.buildVehicleDetail(vehicle[0]) // Assuming getInventoryById returns an array

  res.render("./inventory/detail", {
      title: vehicle[0].inv_make + " " + vehicle[0].inv_model + " Details",
      nav,
      detail,
  })
}


// Controller function to trigger a 500 error
invCont.triggerServerError = async function (req, res, next) {
  throw new Error("Intentional Server Error");
};




// Build management view
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", { title: "Inventory Management", nav, errors: null });
};

// Build add classification view
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", { title: "Add Classification", nav, errors: null });
};

// Add classification process
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const regResult = await invModel.addClassification(classification_name);

  if (regResult) {
    req.flash("notice", `Classification "${classification_name}" added successfully.`);
    res.redirect("/inv/");
  } else {
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: [{ msg: "Failed to add classification." }],
    });
  }
};

// Build add inventory view
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", { title: "Add Inventory Item", nav, classificationList, errors: null });
};

// Add inventory process
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList(req.body.classification_id);
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

  const regResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);

  if (regResult) {
    req.flash("notice", "Inventory item added successfully.");
    res.redirect("/inv/");
  } else {
    res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      errors: [{ msg: "Failed to add inventory item." }],
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

module.exports = invCont
