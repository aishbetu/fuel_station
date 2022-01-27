const dbConn = require('../../config/db.config');

const Stations = function (station){
    this.station_name = station.station_name;
    this.x_coordinate = station.x_coordinate;
    this.y_coordinate = station.y_coordinate;
    this.fuel_price = station.fuel_price;
}

// method to fetch all fuel stations
Stations.getAllStations = (result) => {
    dbConn.query('SELECT * FROM stations', (err, res) => {
        if (err){
            console.log('Error while fetching stations', err);
            result(err, null);
        } else {
            console.log('Stations fetched successfully');
            result(null, res)
        }
    })
}


// method to create new fuel station in db
Stations.addNewStation = (stationReqData, result) => {
    dbConn.query('INSERT INTO stations SET ? ', stationReqData, (err, res) => {
        if (err) {
            result(err, null);
        }else {
            console.log('Station inserted successfully');
            result(null, res);
        }
    })
}

// method to update fuel price
Stations.editFuelPrice = (id, fuelReqData, result) => {
    dbConn.query('UPDATE stations SET fuel_price=? WHERE id=?', [fuelReqData.fuel_price, id], (err, res) => {
        if (err) {
            console.log("Error while updating fuel price", err);
            result(err, null);
        } else {
            console.log('Fuel price has been updated successfully!');
            result(null, res);
        }
    });
}

// method to delete an station from db
Stations.removeStation = (id, result) => {
    dbConn.query('DELETE FROM stations WHERE id=?', [id], (err, res) => {
        if (err) {
            console.log('Error while deleting the station!');
            result(err, null);
        } else {
            result(null, res);
        }
    });
}

// method to fetch nearest fuel stations from db
Stations.findNearbyStations = (xCordinateNumber, yCordinateNumber, result) => {
    // Using Haversine Formula to calculate nearest stations from user distance
    dbConn.query('SELECT station_name, ( 6371 * acos( cos( radians(?) ) * cos( radians( y_coordinate ) ) * cos( radians( x_coordinate ) - radians(?) ) + sin( radians(?) ) * sin( radians( y_coordinate ) ) ) ) AS distance FROM stations HAVING distance < 900 ORDER BY distance LIMIT 0 , 3',
        [yCordinateNumber, xCordinateNumber, yCordinateNumber], (err, res) => {
        if (err) {
            console.log('Error while finding nearest stations');
            result(err, null);
        } else {
            result(null, res);
        }

        });
}

module.exports = Stations;
