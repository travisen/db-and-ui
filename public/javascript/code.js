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
		var payload = {
			name: null,
			reps: null,
			weight: null,
			date: null,
			lbs: null
		};
		var tableRef = document.getElementById("ex-table").getElementsByTagName("tbody")[0];

		// insert a row in table at last row
		var newRow = tableRef.insertRow(tableRef.rows.length);

		//insert a cell in the row
		var newCell = newRow.insertCell(0);
	
		// lbs return true, kg return false
		if (document.getElementById('lbs-true').checked == 'on'){
			payload.lbs = true;
		} else {
			payload.lbs = false;
		}

		//removes hyphens and spaces from date
		var date = payload.date = document.getElementById('ex-date').value;
		var dateParsed = date.replace(/-|\s/g,"");

		// set values of each property in payload
		payload.name = document.getElementById('ex-name').value;
		payload.reps = document.getElementById('ex-reps').value;
		payload.weight = document.getElementById('ex-weight').value;
		payload.date = dateParsed;
		payload.lbs = document.getElementById('lbs-true').checked;

		console.log("payload client side:", payload);
		req.open("POST", "http://localhost:3009/insert", true); // on AWS change to 52.36.142.254

		req.setRequestHeader('Content-Type', 'application/json');
		
		req.addEventListener('load', function() {
			if(req.status >= 200 && req.status < 400) {
				console.log("create req was sent to server");

				var response = JSON.parse(req.responseText);
				var workoutObject = response.workouts; // workout id


				var table = document.getElementById("table-body");
				var newRow = table.insertRow(-1); // add row at end of table

				//id
				var cellId = document.createElement('td');
				cellId.textContent = workoutObject.id;
				cellId.style.display="none"
				newRow.appendChild(cellId);

				//ex name
				var cellName = document.createElement('td');
				cellName.textContent = workoutObject.name;
				newRow.appendChild(cellName);

				//ex reps
				var cellReps = document.createElement('td');
				cellReps.textContent = workoutObject.reps;
				newRow.appendChild(cellReps);

				//ex weight
				var cellWeight = document.createElement('td');
				cellWeight.textContent = workoutObject.weight;
				newRow.appendChild(cellWeight);

				//ex date
				var cellDate = document.createElement('td');
				cellDate.textContent = workoutObject.date;
				newRow.appendChild(cellDate);

				//ex units of weight
				var cellUnits = document.createElement('td');
				//cellUnits.textContent = workoutObject.lbs;
				if (workoutObject.lbs == 1){
					cellUnits.textContent = "lbs";
				} 
				else {
					cellUnits.textContent = "kgs";
				}
				newRow.appendChild(cellUnits);


				//var response = JSON.parse(req.responseText);
				//document.getElementById('')
				console.log("response from server on client", response.workouts);
				//var newText = document.createTextNode(response.data); //this'll be changed when sql is added
				//newCell.appendChild(newText);


			} else {
				console.log("Error in network request: " + req.statusText);
			}
		});
	    req.send(JSON.stringify(payload));
	    event.preventDefault();
	}); /*end submit data button*/
	
   	/* get('http://localhost:3009/select-all', function (data, status){
		if (status == 'success'){
			var tableData = JSON.parse(data);
		}
	});*/
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