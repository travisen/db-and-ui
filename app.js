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
app.post('/insert',function(req,res,next){
  //console.log("server data", postParameters);
  var context = {};
  var postParameters = [];

  //console.log("req body", req.body);
  postParameters.push(req.body)

  //JSON.parse(postParameters); data should already be parsed this throws error
  //console.log("server data after parsing!!", postParameters);
  // fix date input. shows as 0000-00-00
  //var test = {name: "lunges", reps: "12", weight: "1000", date: 2016-05-30, lbs: true};
  mysql.pool.query('INSERT INTO workouts SET ?', postParameters, function(err,result){
    if(err){
      next(err);
      return;
    }

  mysql.pool.query('SELECT * FROM workouts ORDER BY id DESC LIMIT 1',function(err,rows,fields){
    if(err){
      next(err);
      return;
    }

    // save rows in an array
    context.workouts = rows[0];
    console.log("db sending back to server", context);    
    //res.render('home', context);
    res.send(JSON.stringify(context));
  //});
  //document.addEventListener('DOMContentLoaded', bindButtons);
  });
   // context.workouts = result;
   // console.log(result);
    //res.send(JSON.stringify(context));
  });
  //res.render('home',context);
});

app.get('/',function(req,res,next){
  
  var context = {};
  var exerciseList = [];

  mysql.pool.query('SELECT * FROM workouts ORDER BY id DESC LIMIT 1',function(err,rows,fields){
    if(err){
      next(err);
      return;
    }

    // save rows in an array
    context.workouts = rows[0];
    //console.log("return data from db", context);
    
    res.render('home');
  //});
  //document.addEventListener('DOMContentLoaded', bindButtons);
  });
});

// route to select all from table
app.get('/select-all', function(req,res,next){
  mysql.pool.query('SELECT * FROM workouts',function(err,rows,fields){
    if(err){
      next(err);
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

app.get('/delete-row', function(req,res,next ){
  //var context {};
  mysql.pool.query('DELETE FROM `workouts` WHERE id =?', [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT * FROM `workouts`', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      res.send(JSON.stringify(rows));
    });
  });
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
