const express = require('express');
const router = express.Router();
const path = require("path");
const utilities = require("../utilities");

// Asynchronous Route with Error Handling
router.get("/some-async-route", utilities.handleErrors(async (req, res, next) => {
    try {
        res.send("Async result");
    } catch (error) {
        next(error);
    }
}));


router.use(express.static(path.join(__dirname, "..", "public")));
router.use("/css", express.static(path.join(__dirname, "..", "public/css")));
router.use("/js", express.static(path.join(__dirname, "..", "public/js")));
router.use("/images", express.static(path.join(__dirname, "..", "public/images")));

module.exports = router;