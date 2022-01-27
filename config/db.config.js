const mysql = require('mysql');

const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass@123',
    database: 'fuel_stations'
});

dbConn.connect((error) => {
    if (error) throw error;
    console.log('Database has been connected successfully!');
})

module.exports = dbConn;
