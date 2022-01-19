const express = require('express');

const router = express.Router();

const StationController = require('../controllers/fuelStation.controller');

// creating routes

// route to get all stations
router.get('/', StationController.getStationsList);

// post station route
router.post('/', StationController.createStation);

module.exports = router;


