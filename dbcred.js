var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'default',
  database        : 'workouts'
});
console.log("im running");
module.exports.pool = pool;