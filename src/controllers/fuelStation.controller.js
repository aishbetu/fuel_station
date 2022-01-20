const StationModel = require('../models/fuelStation.model');


// we'll use async await here

exports.getStationsList = (req, res) => {
    // console.log('here all station list');
    StationModel.getAllStations((err, stations) => {
        console.log('We are here');
        if (err) {
            return res.status(500).send(err);
        }
        console.log('Stations:', stations);
        res.status(200).send(stations);
    });
}

exports.createStation = (req, res) => {
    console.log('create new station');
    // console.log(req.body);
    const stationReqData = new StationModel(req.body);
    // validating if input in not undefined
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({success: false, message: 'please fill all fields'})
    }
    // validating if x co-ordinate
    if ((req.body.x_coordinate < -180) || (req.body.x_coordinate > 180)){
        return res.status(400).send({success: false, message: 'X co-ordinate is not valid'});
    }
    // validating if y co-ordinate
    if ((req.body.y_coordinate < -90) || (req.body.y_coordinate > 90)) {
        return res.status(400).send({success: false, message: 'Y co-ordinate is not valid'});
    }
    // sending data to model to save in db
    else {
        console.log('valid data')
        StationModel.addNewStation(stationReqData, (err, station) => {
            if (err){
                if (err.errno == 1062) {
                    // console.log("Error occurred!!");
                    return res.status(406).send(err.code);
                }
                return res.status(500).send(err);
            }
            res.status(201).send({success: true, message: 'Station has been inserted successfully', data: station});
        });
    }
}

// put route to update fuel price
exports.updateFuelPrice = (req, res) => {
    const fuelReqData = new StationModel(req.body);
    // validating if input empty
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({success: false, message: 'please fill fuel price field'})
    }
    const { station_name, x_coordinate, y_coordinate, fuel_price } = req.body;

    // validating for only fuel price can be updated
    if (fuel_price && req.params.id) {
        if (station_name || x_coordinate || y_coordinate) {
            return res.status(400).send({success: false, message: 'only fuel price can be updated! '});
        }
        else {
            StationModel.editFuelPrice(req.params.id, fuelReqData, (err, fuel) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).send({success: true, message: 'fuel price has been updated successfully', data: fuel});
            })

        }
    }

}

// delete station
exports.deleteStation = (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({success: false, message: 'Please provide station id'});
    }
    StationModel.removeStation(req.params.id, (err, station) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send({success: true, message: 'Station has been deleted successfully', data: station});
    })
}


// fetch top 3 nearby stations from user location
exports.getNearestStations = (req, res) => {
    if (!req.params.long || !req.params.lat) {
        return res.status(400).send({message: 'Please provide latitude and longitude both'});
    }
    const x_cordinate = req.params.long; // x -> Longitude
    const y_cordinate = req.params.lat; // y -> Latitude

    // split str to = then parse it to float
    const xCordinateNumber = parseFloat(x_cordinate.split("=").pop());
    const yCordinateNumber = parseFloat(y_cordinate.split("=").pop());

    // pass these co-ordinates to model method to get results
    StationModel.findNearbyStations(xCordinateNumber, yCordinateNumber, (err, stations) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log(stations);
        res.status(200).send({success: true, message: 'Station has been deleted successfully', data: stations});
    })
}
