const config    = require('./data/config.json');
const mysql     = require('mysql2/promise');
const mysqlConfig = {
    connectionLimit : config.database['connectionLimit'],
    host     : config.database['host'],
    user     : config.database['user'],
    password : config.database['pass'],
    database : config.database['db'],
    charset  : config.database['charset'],
    dateStrings: true
}

module.exports = mysql.createPool(mysqlConfig);