const db1 = require('../config/db_payroll');
const db = require('../config/db_hr');

var Request = require('tedious').Request;

const index = async(req, res) => {
    let employeeList = [];
    let employees = [];
    let employeePro = [];
    let employeeVacation = [];
    let e = [];
    let employeeBirthDay = [];
    let employeeAnniversary = [];
    let eCurr = [];
    const sql =
        "SELECT  * FROM employee JOIN pay_rates ON employee.PayRates_id=pay_rates.idPay_Rates";
    const sql1 = "SELECT format(Personal.BirthDay, 'MM/dd/yyyy') as date,* FROM Personal";

    db1.query(sql, function(error, results, fields) {
        if (error) throw error;

        employees = results;
    });

    request = new Request(sql1, (err, rowCount, rows) => {
        if (err) {
            throw err;
        } else {
            employeeList.forEach((employee, index) => {
                // const newEmp = {
                //     ...employee,
                //     ...employees[index],
                // };
                employeePro.push(employee);
                e = employees;
            });

            employeePro.forEach((employee) => {


                var a = new Date(employee.date);
                var x = new Date(employee.hireDate)
                var current = new Date();
                
                if(a.getMonth() == current.getMonth())
                    employeeBirthDay.push(employee)
                if(x.getMonth() == current.getMonth())
                    employeeAnniversary.push(employee)
                if(employee.Vacation_Days > 2)
                    employeeVacation.push(employee)
                if(a == current)
                    eCurr.push(employee)

            });
            e.forEach((employee) => {

                if(employee.Vacation_Days > 2)
                    employeeVacation.push(employee)
            });
        }

        res.render('Alert/index', {
            employeeList: employeePro,
            employeeVacation,
            employeeBirthDay,
            employeeAnniversary,
            e,
            eCurr,
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