// Set up JDBC connection
var presto = require('presto-client');
var client = new presto.Client({user: 'presto', host: '34.74.56.14', catalog: 'hive', schema: 'leap'});
////////////////////////////////////////////////////////////////////
// param: callback function, pass it the user id retrieved from query
////////////////////////////////////////////////////////////////////
function getUser(getAllergies) {
    let results;

    //Query the users id
    const query = "select json_extract_scalar(json,'$.id') from patient p " +
    "WHERE json_extract_scalar(json,'$.name[0].family[0]')  = 'Zboncak558' " +
    "AND json_extract_scalar(json,'$.name[0].given[0]') = 'Marshall526'";

    //Query the Analytics Engine
    client.execute({
        query:   query,
        catalog: 'hive',
        schema:  'leap',
        state:   function(error, query_id, stats){ console.log({message:"status changed", id:query_id, stats:stats}); },
        columns: function(error, data){ console.log({resultColumns: data}); },
        data:    function(error, data, columns, stats){ 
            //Set results to the data
            results = data;
        },
        success: function(error, stats){
            //If successful, pass the users id to allergies
            getAllergies(results);
        },
        error:   function(error){ console.log('e', error) }
    });    
}
////////////////////////////////////////////////////////////////////
// param1: userId passed to query
// param2: Callback, pass it the resulting list of allergies from query
////////////////////////////////////////////////////////////////////
function getAllergieList(userId, displyresults) {
    let results;

    //Query for the allergies
    const query = "select json_extract_scalar(json,'$.substance.coding[0].code'), " +
    "json_extract_scalar(json,'$.substance.coding[0].display') from allergyintolerance " +
    "WHERE json_extract_scalar(json,'$.patient.reference')  = " + "'urn:uuid:" + userId + "'";

    //Query the Analytics Engine
    client.execute({
        query:   query,
        catalog: 'hive',
        schema:  'leap',
        state:   function(error, query_id, stats){ console.log({message:"status changed", id:query_id, stats:stats}); },
        columns: function(error, data){ console.log({resultColumns: data}); },
        data:    function(error, data, columns, stats){ 
            //set results to the data we want to return
            results = data;
        },
        success: function(error, stats){
            //If successful, display the results
            displyresults(results);
        },
        error:   function(error){ console.log('error found, it is: ', error) }
    });  
}

getUser((id) => {
    //Once the user id is found, query for their allergies
    getAllergieList(id, (allergieList) => {
        //Display the allergies
        console.log("Code       Description");
        for (var key in allergieList) {
            if (allergieList.hasOwnProperty(key)) {
                console.log(allergieList[key][0] + "--->" + allergieList[key][1]);
            }
        }
    });
}); 