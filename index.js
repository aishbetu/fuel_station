const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");

// local imports
const stationRoutes = require('./src/routes/fuelStation.route');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/', (req, res) => {
    res.send('Hello Node Bro');
});

app.use('/api/v1/stations', stationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});
