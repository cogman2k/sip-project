const express = require('express');
const bodyParser = require('body-parser');

const db_hr = require('./config/db_hr');
const db_payroll = require('./config/db_payroll');

var indexRoute = require('./routes/index');
var hrRoute = require('./routes/hr.route');
var earningsRoute = require('./routes/earnings.route');
var payrollRoute = require('./routes/payroll.route');
var totalVacation = require('./routes/totalVacationDay.route')
var averageBenefit = require('./routes/averageBenefit.route')
var alert = require('./routes/alert.route')


const app = express();
const port = 3000;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));

// CONNECT TO SQL SERVER
db_hr.on('connect', (err) => {
    if (err) {
        console.log('Connection Failed');
        throw err;
    }

    console.log('Connected to SQL SERVER!');
    // executeStatement();
});

db_hr.connect();

// CONNECT TO MYSQL
db_payroll.connect();

db_payroll.query('SELECT 1', function(error, results, fields) {
    if (error) throw error;
        console.log('Connected to MYSQL');
});

app.use('/', indexRoute);

app.use('/hr', hrRoute);
app.use('/payroll', payrollRoute);
app.use('/earnings', earningsRoute);
app.use('/totalVacationDay', totalVacation);
app.use('/averageBenefit', averageBenefit);
app.use('/alert', alert);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});