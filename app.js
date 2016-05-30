var express = require('express');
//var mysql = require('./dbcred.js');

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'default',
  database        : 'workouts'
});

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3009);
app.use(express.static('public'));

app.get('/',function(req,res){
  res.render('home');
  //document.addEventListener('DOMContentLoaded', bindButtons);
});

app.get('/add-ex', function(req,res){
	res.render('home');
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
