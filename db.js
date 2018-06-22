const config    = require('./data/config.json');
const mysql     = require('mysql');

const mysqlConfig = {
    connectionLimit : config.database['connectionLimit'],
    host     : config.database['host'],
    user     : config.database['user'],
    password : config.database['pass'],
    database : config.database['db'],
    charset  : config.database['charset'],
    dateStrings: true
}

var connection;

function handleDisconnect() {
    connection = mysql.createConnection(mysqlConfig);
  
    connection.connect(function(err) {
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
  
handleDisconnect();

module.exports = connection;