document.addEventListener('DOMContentLoaded', bindButtons);
/* DOM example
document.body.onload = addElement;

function addElement () { 
  // create a new div element 
  // and give it some content 
  var newDiv = document.createElement("div"); 
  var newContent = document.createTextNode("Hi there and greetings!"); 
  newDiv.appendChild(newContent); //add the text node to the newly created div. 

  // add the newly created element and its content into the DOM 
  var currentDiv = document.getElementById("div1"); 
  document.body.insertBefore(newDiv, currentDiv); 
}
*/

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

	/* reset table button */
	document.getElementById("ex-reset").addEventListener('click', function(event){

	});
}
/*
Add event listener Example

document.getElementById('zipSubmit').addEventListener('click', function(event) {
  var req = new XMLHttpRequest();
  var payload = {zip:null};

  // saves value of field zipIn to payload.zip
  payload.zip = document.getElementById('zipIn').value; 
  //console.log(payload);
  //console.log(payload.zip);

  req.open("POST", "http://api.openweathermap.org/data/2.5/weather?zip=" + payload.zip + 
    ",us&APPID=" + apikey, true);
  
 // req.setRequestHeader('Content-Type', 'application/json');

  req.addEventListener('load', function() {
    if(req.status >= 200 && req.status < 400) {
    var response = JSON.parse(req.responseText);
    document.getElementById('city').textContent = response.name;
    document.getElementById('temp').textContent = response.main.temp;
    document.getElementById('humidity').textContent = response.main.humidity;
    } else {
      console.log("Error in network request: " + request.statusText);
    }
  });

 req.send(JSON.stringify(payload));
 event.preventDefault();
})
*/