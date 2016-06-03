var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'default',
  database        : 'workouts',
  dateStrings     : 'date'
});

module.exports.pool = pool;