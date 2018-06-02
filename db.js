const config    = require('./data/config.json');
const mysql     = require('mysql');
var connection  = mysql.createConnection({
    connectionLimit : config.database['connectionLimit'],
    host     : config.database['host'],
    user     : config.database['user'],
    password : config.database['pass'],
    database : config.database['db'],
    charset  : config.database['charset'],
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;