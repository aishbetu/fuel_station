const dbConn = require('../../config/db.config');

const Stations = function (station){
    this.station_name = station.station_name;
    this.x_coordinate = station.x_coordinate;
    this.y_coordinate = station.y_coordinate;
    this.fuel_price = station.fuel_price;
}

// get all stations
// // // // result is callback function
Stations.getAllStations = (result) => {
    dbConn.query('SELECT * FROM stations', (err, res) => {
        if (err){
            console.log('Error while fetching stations', err);
            result(null, err);
        } else {
            console.log('Stations fetched successfully');
            result(null, res)
        }
    })
}

// create new fuel station in db
Stations.addNewStation = (stationReqData, result) => {
    dbConn.query('INSERT INTO stations SET ? ', stationReqData, (err, res) => {
        if (err) {
            console.log('Error while inserting station', err);
            result(err, null);
        }else {
            console.log('Station inserted successfully');
            result(null, res);
        }

        // try {
        //     console.log('Station inserted successfully');
        //     result(null, res);
        // }catch (err) {
        //     console.log('error occurred' + err);
        //     result(err, null);
        // }
    })
}

module.exports = Stations;
