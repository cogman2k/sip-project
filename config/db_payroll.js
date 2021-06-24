var mysql = require('mysql2');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ly141100',
    database: 'mydb',
});

module.exports = connection;