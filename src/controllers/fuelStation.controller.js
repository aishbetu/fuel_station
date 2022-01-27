const StationModel = require('../models/fuelStation.model');


// handling get route to get all fuel stations
exports.getStationsList = (req, res) => {
    // console.log('here all station list');
    StationModel.getAllStations((err, stations) => {
        // console.log('We are here');
        if (err) {
            return res.status(500).send(err);
        }
        console.log('Stations:', stations);
        res.status(200).send(stations);
    });
}

// handling post route to add new fuel station
exports.createStation = (req, res) => {
    // console.log('create new station');

    // trimming co-ordinates till 4 decimal
    const newLat = parseFloat(req.body.y_coordinate.toFixed(4));
    const newLong = parseFloat(req.body.x_coordinate.toFixed(4));

    // creating an object with trimmed co-ordinates along with original body of name & price
    const stationObj = {
        station_name: req.body.station_name,
        x_coordinate: newLong,
        y_coordinate: newLat,
        fuel_price: req.body.fuel_price
    };

    // passing data to Station Model Constructor
    const stationReqData = new StationModel(stationObj);

    // validating if input in not undefined
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({success: false, message: 'Please fill all fields'})
    }

    // validating station name must not be number
    if (!isNaN(req.body.station_name)) {
        return res.status(400).send({success: false, message: 'Station name can only be string!'})
    }

    // validating x co-ordinate
    if ((req.body.x_coordinate < -180) || (req.body.x_coordinate > 180)){
        return res.status(400).send({success: false, message: 'X co-ordinate is not valid'});
    }
    // validating y co-ordinate
    if ((req.body.y_coordinate < -90) || (req.body.y_coordinate > 90)) {
        return res.status(400).send({success: false, message: 'Y co-ordinate is not valid'});
    }

    if (req.body.fuel_price < 0) {
        return res.status(400).send({success: false, message: 'fuel price can not be negative'});
    }

    // sending data to model to save in db
    else {
        // console.log('valid data')
        StationModel.addNewStation(stationReqData, (err, station) => {
            if (err){
                // if city already exist, send duplicate entry error
                if (err.errno == 1062) {
                    // console.log("Error occurred!!");
                    return res.status(406).send({success: false, message: "Station name already exist"});
                }
                return res.status(500).send(err);
            }
            res.status(201).send({success: true, message: 'Station has been inserted successfully', data: station});
        });
    }
}


// handling put route to update fuel price
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
        if (fuel_price < 0) {
            return res.status(400).send({success: false, message: 'fuel price can not be negative'});
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

// handling delete route to update fuel price
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


// handling get route to fetch top 3 nearby stations from user location
exports.getNearestStations = (req, res) => {
    if (!req.params.long || !req.params.lat) {
        return res.status(400).send({message: 'Please provide latitude and longitude both'});
    }
    // validating x co-ordinate
    if ((req.params.long < -180) || (req.params.long > 180)){
        return res.status(400).send({success: false, message: 'X co-ordinate is not valid'});
    }
    // validating y co-ordinate
    if ((req.params.lat < -90) || (req.params.lat > 90)) {
        return res.status(400).send({success: false, message: 'Y co-ordinate is not valid'});
    }
    const x_cordinate = req.params.long; // x -> Longitude
    const y_cordinate = req.params.lat; // y -> Latitude

    // split str cords to = then parse 1st index to float
    const xCordinateNumber = parseFloat(x_cordinate.split("=").pop());
    const yCordinateNumber = parseFloat(y_cordinate.split("=").pop());

    // pass these cordinates to model method to get results
    StationModel.findNearbyStations(xCordinateNumber, yCordinateNumber, (err, stations) => {
        if (err) {
            return res.status(500).send(err);
        }
        // trimming the distance from stations object of data upto 2 decimal point
        let trimmedDistanceStaions = stations.map((i) => {
            i.distance = parseFloat(i.distance.toFixed(2))
            return i;
        })
        console.log(trimmedDistanceStaions);
        res.status(200).send({success: true, message: 'Station has been deleted successfully', data: trimmedDistanceStaions});
    })
}
