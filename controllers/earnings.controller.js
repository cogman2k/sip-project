const db1 = require('../config/db_payroll');
const db = require('../config/db_hr');

var Request = require('tedious').Request;

const index = async (req, res) => {
  let employeeList = [];
  let employees = [];
  let employeePro = [];
  let employeePartTime = [];
  let employeeFullTime = [];

  let totalEarnings = 0;
  let totalEarningsMale = 0;
  let totalEarningsFemale = 0;
  let totalEarningsSh = 0;
  let totalEarningsNSh = 0;
  let totalEarningsFullTime = 0;
  let totalEarningsPartTime = 0;

  const sql =
    'SELECT * FROM employee JOIN pay_rates ON employee.PayRates_id=pay_rates.idPay_Rates';
  const sql1 = 'SELECT * FROM Personal';

  db1.query(sql, function (error, results, fields) {
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
        totalEarnings +=
          employee.Pay_Amount *employee.Pay_Rate || 0 ;

        if (employee.Gender) {
          totalEarningsMale +=
            employee.Pay_Amount  * employee.Pay_Rate || 0 ;
        }

        if (!employee.Gender) {
          totalEarningsFemale +=
            employee.Pay_Amount * employee.Pay_Rate || 0 ;
        }

        if (employee.Shareholder_Status) {
          totalEarningsSh +=
            employee.Pay_Amount * employee.Pay_Rate  || 0;
        }

        if (!employee.Shareholder_Status) {
          totalEarningsNSh +=
            employee.Pay_Amount  * employee.Pay_Rate || 0 ;
        }

        if(employee.PayRates_id == 1){
          totalEarningsPartTime += employee.Pay_Amount  * employee.Pay_Rate || 0
        }
        if(employee.PayRates_id == 2){
          totalEarningsFullTime += employee.Pay_Amount  * employee.Pay_Rate || 0
        }
      });
    }

    res.render('Summary/earnings', {
      employeeList: employeePro,
      totalEarnings,
      totalEarningsMale,
      totalEarningsFemale,
      totalEarningsSh,
      totalEarningsNSh,
      totalEarningsPartTime,
      totalEarningsFullTime,
    });
  });

  request.on('row', function (columns) {
    let newEmployee = {};

    columns.forEach(function (column) {
      newEmployee[column.metadata.colName] = column.value;
    });

    employeeList.push(newEmployee);
  });

  db.execSql(request);
};

module.exports = {
  index,
};