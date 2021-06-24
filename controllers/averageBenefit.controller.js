const db1 = require('../config/db_payroll');
const db = require('../config/db_hr');

var Request = require('tedious').Request;

const index = async(req, res) => {
    let employeeList = [];
    let employees = [];
    let employeePro = [];

    let averageBenefit = 0;
    let averageBenefitsSh = 0;
    let averageBenefitNSh = 0;
    let i = 0;
    let a = 0;
    let b = 0;

    const sql =
        'SELECT * FROM employee JOIN pay_rates ON employee.PayRates_id=pay_rates.idPay_Rates';
    const sql1 = 'select *, b.Percentage_CoPay from personal p inner join benefit_plans b on p.Benefit_Plans = b.Benefit_Plan_ID';

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


                averageBenefit += (employee.Value * employee.Percentage_CoPay / 100)||0;
                i++;
                if (employee.Shareholder_Status) {
                    averageBenefitsSh += (employee.Value * employee.Percentage_CoPay / 100)||0;
                    a++;
                }

                if (!employee.Shareholder_Status) {
                    averageBenefitNSh = (employee.Value * employee.Percentage_CoPay / 100)||0;
                    b++;
                }
            });
        }
        var t_averageBenefit = averageBenefit/i;
        var t_averageBenefitsSh = averageBenefitsSh/a;
        var t_averageBenefitNSh = averageBenefitNSh/b;
        t_averageBenefit = t_averageBenefit.toFixed(2);
        t_averageBenefitsSh = t_averageBenefitsSh.toFixed(2);
        t_averageBenefitNSh = t_averageBenefitNSh.toFixed(2);

        res.render('Summary/averageBenefit', {
            employeeList: employeePro,
            t_averageBenefit,
            t_averageBenefitsSh,
            t_averageBenefitNSh,
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