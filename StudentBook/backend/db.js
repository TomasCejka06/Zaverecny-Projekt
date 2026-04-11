const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "cejkatomas",
    password: "123456",
    database: "4c2_cejkatomas_db2"
});

db.connect(err => {
    if (err) throw err;
    console.log("DB připojena");
});

module.exports = db;