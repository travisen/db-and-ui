var express = require('express');
var mysql = require('./dbcred.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3009);
app.use(express.static('public'));

app.get('/',function(req,res){
  res.render('home');
  //document.addEventListener('DOMContentLoaded', bindButtons);
  function bindButtons(){

  /*submit data button*/
  document.getElementById('submit-data').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var payload = {};

    var tableRef = document.getElementById("ex-table").getElementsByTagName("tbody")[0];
    console.log(tableRef);
    // insert a row in table at last row
    var newRow = tableRef.insertRow(tableRef.rows.length);

    //insert a cell in the row
    var newCell = newRow.insertCell(0);

    //var newText = document.createTextNode('sdsadsadsNew row');
    //newCell.appendChild(newText);

    payload = document.getElementById('ex-name').value;
    //console.log(payload);
    req.open("POST", "http://httpbin.org/post", true);

    req.setRequestHeader('Content-Type', 'application/json');

    req.addEventListener('load', function() {
      if(req.status >= 200 && req.status < 400) {
        var response = JSON.parse(req.responseText);
        //document.getElementById('')
        console.log(response);
        var newText = document.createTextNode(response.data); //this'll be changed when sql is added
        newCell.appendChild(newText);
      } else {
        console.log("Error in network request: " + request.statusText);
      }
    });

      req.send(payload);
      event.preventDefault();
  });
  /*end submit data button*/
  }
});

app.get('/add-ex', function(req,res){
	res.render('home');
});

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
