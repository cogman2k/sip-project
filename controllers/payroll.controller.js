const db = require('../config/db_hr');
const db1 = require('../config/db_payroll');

var Request = require('tedious').Request;

const index = async(req, res) => {
    const sql =
        'SELECT * FROM employee JOIN pay_rates ON employee.PayRates_id=pay_rates.idPay_Rates';

    db1.query(sql, function(error, results, fields) {
        if (error) throw error;

        res.render('Payroll/index', {
            employees: results,
        });
    });
};

const create = (req, res) => {
    const sql = 'SELECT * FROM employee';

    db1.query(sql, function(error, results, fields) {
        if (error) throw error;

        res.render('Payroll/create', {
            smartId: results[results.length - 1] ?.idEmployee || 0,
            proId: results[results.length - 1] ?.Employee_Number || 1000
        });
    });
};

const postCreate = (req, res) => {
    // console.log(req.body);
    const dataArray = Object.values(req.body);
    const data = dataArray.map((x) => "'" + x + "'").join(',');

    const sql =
        'INSERT INTO employee (Employee_Number, idEmployee, First_Name, Last_Name, SSN, PayRates_id, Pay_Rate, Vacation_Days) VALUES (' +
        data +
        ')';

    db1.query(sql, function(error, results, fields) {
        if (error) throw error;

        res.redirect('/payroll');
    });
};

const edit = (req, res) => {
    const employeeNumber = req.params.id;
    const sql = 'SELECT * FROM employee WHERE Employee_Number=' + employeeNumber;

    db1.query(sql, function(error, results, fields) {
        if (error) throw error;

        res.render('Payroll/edit', {
            employee: results[0],
        });
    });
};

const postEdit = (req, res) => {
    const index = req.params.id;

    const {
        employeeNumber,
        employeeId,
        firstName,
        lastName,
        payRateId,
        payRate,
        SSN,
        vacationDays,
    } = req.body;

    const sql =
        "UPDATE employee SET Employee_Number= '" +
        employeeNumber +
        "', First_Name= '" +
        firstName +
        "', Last_Name= '" +
        lastName +
        "', SSN= '" +
        SSN +
        "', PayRates_id= '" +
        payRateId +
        "', Pay_Rate= '" +
        payRate +
        "', Vacation_Days= '" +
        vacationDays +
        "', idEmployee= '" +
        employeeId +
        "' WHERE Employee_Number= " +
        index;

    db1.query(sql, function(error, results, fields) {
        if (error) throw error;

        res.redirect('/payroll');
    });
};

const deleteEmployee = (req, res) => {
    const employeeNumber = req.params.id;
    const sql = 'DELETE FROM employee WHERE Employee_Number=' + employeeNumber;
    const sql1 =
        'SELECT idEmployee FROM employee WHERE Employee_Number=' + employeeNumber;

    db1.query(sql1, (error, results) => {
        const employeeId = results[0].idEmployee;
        const sql2 = 'DELETE FROM Personal WHERE Employee_ID=' + employeeId;

        db1.query(sql, (error) => {
            if (error) throw error;

            request = new Request(sql2, (err) => {
                if (err) {
                    throw err;
                }
            });

            db.execSql(request);

            res.redirect('/payroll');
        });
    });
};

module.exports = {
    index,
    create,
    postCreate,
    edit,
    postEdit,
    deleteEmployee,
};