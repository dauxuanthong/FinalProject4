const express = require("express");
const router = express.Router();
const searchController = require("../Controllers/SearchController");
const authenticationController = require("../Controllers/AuthenticateController");

// /search/searchDetail
router.get("/searchDetail", authenticationController.identifyUser, searchController.searchDetail);
// /search/:value
router.get("/:value", authenticationController.identifyUser, searchController.getAllSearchData);

module.exports = router;
