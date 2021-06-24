const db1 = require('../config/db_payroll');
const db = require('../config/db_hr');

var Request = require('tedious').Request;

const index = async(req, res) => {
    let employeeList = [];
    let employees = [];
    let employeePro = [];

    let totalVacationDay = 0;
    let totalVacationDayMale = 0;
    let totalVacationDayFeMale = 0;
    let totalVacationDaysSh = 0;
    let totalVacationDayNSh = 0;
    let totalVacationDayFullTime = 0;
    let totalVacationDayPartTime = 0;

    const sql =
        'SELECT * FROM employee JOIN pay_rates ON employee.PayRates_id=pay_rates.idPay_Rates';
    const sql1 = 'SELECT * FROM Personal';

    db1.query(sql, function(error, results, fields) {
        if (error) throw error;

        employees = results;
    });

    request = new Request(sql1, (err, rowCount, rows) => {
        if (err) {
            throw err;
        } else {
            employeeList.forEach((employee, index) => {
                const newEmp = {
                    ...employee,
                    ...employees[index],
                };
                employeePro.push(newEmp);
            });

            employeePro.forEach((employee) => {


                totalVacationDay += employee.Vacation_Days||0;

                if (employee.Gender) {
                    totalVacationDayMale += employee.Vacation_Days||0;
                }

                if (!employee.Gender) {
                    totalVacationDayFeMale += employee.Vacation_Days||0;
                }

                if (employee.Shareholder_Status) {
                    totalVacationDaysSh += employee.Vacation_Days||0;
                }

                if (!employee.Shareholder_Status) {
                    totalVacationDayNSh += employee.Vacation_Days||0;
                }

                if(employee.PayRates_id == 1){
                    totalVacationDayPartTime += employee.Vacation_Days || 0;
                }
                if(employee.PayRates_id == 2){
                    totalVacationDayFullTime += employee.Vacation_Days || 0;
                }
            });
        }

        res.render('Summary/totalVacationDay', {
            employeeList: employeePro,
            totalVacationDayMale,
            totalVacationDayFeMale,
            totalVacationDayNSh,
            totalVacationDaysSh,
            totalVacationDay,
            totalVacationDayPartTime,
            totalVacationDayFullTime,
        });
    });

    request.on('row', function(columns) {
        let newEmployee = {};

        columns.forEach(function(column) {
            newEmployee[column.metadata.colName] = column.value;
        });

        employeeList.push(newEmployee);
    });

    db.execSql(request);
};

module.exports = {
    index,
};