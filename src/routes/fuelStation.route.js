const express = require('express');

const router = express.Router();

const StationController = require('../controllers/fuelStation.controller');

// creating routes

// route to get all stations
router.get('/', StationController.getStationsList);

// post station route
router.post('/', StationController.createStation);

// put route update fuel price
router.put('/:id', StationController.updateFuelPrice);

// delete station
router.delete('/:id', StationController.deleteStation);


// get nearest stations route
router.get('/find/:lat/:long', StationController.getNearestStations);

module.exports = router;


