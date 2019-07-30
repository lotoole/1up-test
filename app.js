////////////////////////////////////////////////////////////////////
//
// 1upHealth test
//
// - Get and display the allergies of user Marshall526 Zboncak558
//
// Author: Liam O'Toole
// Data: July 30, 2019
//
/////////////////////////////////////////////////////////////////////

//include required built in modules
const express = require('express');
const app = express();
//Include function for retrieving list of allergies
const allergies = require('./allergies');

//connect to machine servers
const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`Succesfully connected on port ${port}...`);
});