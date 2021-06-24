var Connection = require('tedious').Connection;

var config = {
    server: 'DESKTOP-2LSBN3N',
    authentication: {
        type: 'default',
        options: {
            userName: 'sa',
            password: 'ly141100',
        },
    },
    options: {
        port: 1433,
        trustServerCertificate: true,
        database: 'HR',
        rowCollectionOnRequestCompletion: true,
    },
};

module.exports = new Connection(config);