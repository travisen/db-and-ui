var express = require('express');
var mysql = require('./dbcred.js');
var bodyParser = require('body-parser'); //to handle post requests

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3009);

app.use(express.static('public'));

// allows parsing of requests sent to this server from a client
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Handles Data sent from client and inserts in db */
app.post('/get-row',function(req,res){
  //console.log("server data", postParameters);

  var postParameters = [];
  for(var q in req.body){
    postParameters.push({'key':q, 'value':req.body[q]})
  }
  console.log("server data", postParameters);
  // fix date input. shows as 0000-00-00
  //var test = {name: "lunges", reps: "12", weight: "1000", date: 2016-05-30, lbs: true};
  mysql.pool.query('INSERT INTO workouts SET ?', postParameters, function(err,res){
    if(err) throw err;

  });

  /* figure this out one i can insert values manually
  mysql.pool.query("INSERT INTO workouts ('name') VALUES (?)", [req.query.c], function(err, result){
    if(err){
      next(err);
      return;
    }
  }); */
  //context.postData = postParameters;
  //res.render('home',context);
});

// delete this
app.get('/',function(req,res){
  res.render('home');
  //document.addEventListener('DOMContentLoaded', bindButtons);
});

app.get('/add-ex', function(req,res){
	res.render('home');
});

/*Link to easily reset table*/
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
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
