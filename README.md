# Fuel Station
## Backend Server in NodeJS


[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Fuel Station app is built with Node, Express, MySQL techstack ,
## The functionalities of this app are:

- Add new Fuel Sttaions
- View All Stations
- Update Fuel Price
- Delete Fuel Station
- Find top 3 nearby fuel station to user location

## Installation

Fuel Station requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd fuel_station
npm i
```


## Steps to run this project

- Import dump mysql file from "Exported MySQL DB" folder to your workbench.
- Check Wheather the database scehma is created in your workbench.
- Configure your mysql user and password along with db name in folder config/db.config.js
- Run command ``` "npm start"```
- Visit http://localhost:5000/api/v1/stations from your browser or postman.




## License

MIT

