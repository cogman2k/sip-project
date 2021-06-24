const db = require('../config/db_hr');
const db1 = require('../config/db_payroll');

var Request = require('tedious').Request;

const index = async(req, res) => {
    let employeeList = [];

    const sql = "select *, format(Personal.BirthDay, 'dd/MM/yyyy') as date from Personal";

    request = new Request(sql, (err, rowCount, rows) => {
        if (err) {
            throw err;
        } else {
            res.render('HR/index', {
                employees: employeeList,
            });
        }
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

const create = (req, res) => {
    const sql = 'SELECT * FROM Personal';

    request = new Request(sql, (err, rowCount, rows) => {
        if (err) {
            throw err;
        } else {
            res.render('HR/create', {
                smartId: rowCount === 0 ? 0 : rows[rowCount - 1][0].value,
            });
        }
    });

    db.execSql(request);
};

const postCreate = (req, res) => {
    // console.log(req.body);
    const dataArray = Object.values(req.body);
    const data = dataArray.map((x) => "'" + x + "'").join(',');
    var a,b,c;
    a = dataArray[0];
    b = dataArray[1];
    c = dataArray[2];
    const d = [];
    d.push(a);
    d.push(b);
    d.push(c);
    d.push(a);
    d.push(5);
    d.push(1);
    d.push(1);
    d.push(0);
    const data1 = d.map((x) => "'" + x + "'").join(',');
    const sql =
        'INSERT INTO Personal (Employee_ID, First_Name, Last_Name, Gender, City, Email, BirthDay, Phone_Number, Shareholder_Status, Benefit_Plans) VALUES (' +
        data +
        ')';
    const sql1 = 'INSERT INTO employee (idEmployee, First_Name, Last_Name, Employee_Number, SSN, PayRates_id, Pay_Rate, Vacation_Days) VALUES (' +
    data1 + ')';

    request = new Request(sql, (err) => {
        if (err) {
            throw err;
        } else {
            db1.query(sql1);
            res.redirect('/hr');
        }
    });

    db.execSql(request);
};


const edit = (req, res) => {
    const employeeId = req.params.id;
    const sql = 'SELECT * FROM Personal WHERE Employee_ID=' + employeeId;

    let currentEmployee = {};

    request = new Request(sql, (err, rowCount) => {
        if (err) {
            throw err;
        } else {
            res.render('HR/edit', {
                employee: currentEmployee,
            });
        }
    });

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            currentEmployee[column.metadata.colName] = column.value;
        });
    });

    db.execSql(request);
};

const postEdit = (req, res) => {
    const index = req.params.id;

    const {
        employeeId,
        firstName,
        lastName,
        gender,
        city,
        email,
        phone,
        shareholder,
        benefitPlan,
    } = req.body;

    const sql =
        "UPDATE Personal SET Employee_ID= '" +
        employeeId +
        "', First_Name= '" +
        firstName +
        "', Last_Name= '" +
        lastName +
        "', Gender= '" +
        gender +
        "', City= '" +
        city +
        "', Email= '" +
        email +
        "', Phone_Number= '" +
        phone +
        "', Shareholder_Status= '" +
        shareholder +
        "', Benefit_Plans= '" +
        benefitPlan +
        "' WHERE Employee_ID = " +
        index;

    request = new Request(sql, (err) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/hr');
        }
    });

    db.execSql(request);
};

const deleteEmployee = (req, res) => {
    const employeeId = req.params.id;
    const sql = 'DELETE FROM Personal WHERE Employee_ID=' + employeeId;
    const sql1 = 'DELETE FROM employee WHERE idEmployee=' + employeeId;

    request = new Request(sql, (err) => {
        if (err) {
            throw err;
        } else {
            db1.query(sql1);
            res.redirect('/hr');
        }
    });

    db.execSql(request);
};

module.exports = {
    index,
    create,
    edit,
    deleteEmployee,
    postCreate,
    postEdit,
};