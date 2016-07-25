document.addEventListener('DOMContentLoaded', bindButtons);

document.addEventListener('DOMContentLoaded', populateTable(1));

 /* delete row function */
function deleteRow(id) {
	

	console.log("delete id at: ", id);
	var row = document.getElementById(id);
	console.log("row: ", row.nodeName);
	//rowActual = row.parentNode.nodeName;
	//console.log("rowActual: ", rowActual);
	row.parentNode.removeChild(row);
	var payload = {	id };
	
	
	var deleteRequest = new XMLHttpRequest();
	
	deleteRequest.open("POST", "http://localhost:3009/delete-row", true); // change address
	deleteRequest.setRequestHeader('Content-Type', 'application/json');
	deleteRequest.addEventListener('load', function(event){
		// does this even do anything?
	});

	deleteRequest.send(JSON.stringify(payload));
	event.preventDefault();
};

/*
This functions creates buttons for the workout log table.
param:
	workoutObject: response from server.
	count: current column
	curRow: current Row
	nameButton: string that names a button
	declareAction: javascript (passed in as a string) to set buttons action
	on a click
*/
function createButton(workoutObject, count, curRow ,nameButton, declareAction){
	var cellButton = document.createElement('td');
	var aButton = document.createElement('button');
	aButton.class = "button-primary";
	//deleteButton.style = "marigin-bottom:0rem";
	aButton.id = workoutObject[count].id;
	aButton.textContent = nameButton;
	aButton.setAttribute("onclick", declareAction);
	curRow.appendChild(cellButton.appendChild(aButton));
}
/*	
	// remove this...
	Populates table and checks for errors
	popType = 1 populate whole table
	popType = 2 add one row
*/
function populateTable(popType) {
	var reqInitial = new XMLHttpRequest();
	reqInitial.open("GET", "http://localhost:3009/select-all", true); //change address
	reqInitial.setRequestHeader('Content-Type', 'application/json');
	reqInitial.addEventListener('load', function(event){
		if(reqInitial.status >= 200 && reqInitial.status < 400){
		var responseInitial = JSON.parse(reqInitial.responseText);
		var workoutObject = responseInitial.workouts;

		//populate table initial
		var workoutObject = responseInitial; // workout server response
		console.log("length of workout object", workoutObject.length);

		console.log("objects inside", workoutObject);

		// Set starting value for populate table loop
		if (popType == 1)
			var start = 0;
		else if (popType == 2)
			var start = workoutObject.length - 1;
	
		// Reference variable for the entire table.
		var tableRef = document.getElementById("ex-table").getElementsByTagName("tbody")[0];

		//debuggin
		var count =0;

		//loop to populate table
		var table = document.getElementById("table-body");
		for (var i = start; i<workoutObject.length; i++){
			var isId = true;
			var isUnit = 1;

			if(workoutObject.length > 0){
				// Insert a row in tableRef at last row.
				var newRow = tableRef.insertRow(tableRef.rows.length);
				newRow.id = workoutObject[i].id;

			}

			for (var val in workoutObject[i]){
				console.log(workoutObject[i][val]);

				var newCell = document.createElement('td');

				newCell.textContent = workoutObject[i][val];

				if (workoutObject[i].lbs == 1 && isUnit == 6){
					//console.log("workoutObject[i].lbs ", workoutObject[i].lbs)
					newCell.textContent = "lbs";
				} else if (workoutObject[i].lbs == 0 && isUnit == 6) {
					newCell.textContent = "kgs";
				}

				if(isId == true){
					newCell.style.display="none"
					isId = false; 
				}
				newRow.appendChild(newCell);

				isUnit++; // keeps track on whether to turn 0 or 1 into lbs or kgs
				} // end inner loop
				
				console.log("val of I: ", i);
				createButton(workoutObject, i, newRow,
				 "delete", "deleteRow(this.id)");
				createButton(workoutObject, i, newRow,
				 "update", "window.location='update-row?id='+this.id");

			} // end outer loop

		} else 
			console.log("Error in network request: " + reqInitial.statusText);
	});
	reqInitial.send(null);
}
/* end populate table function */

/* binds event listeners to buttons*/
function bindButtons(){

	/*submit data button*/
	if (document == null){
		console.log("document is null");
	}

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
		//var newRow = tableRef.insertRow(tableRef.rows.length);

		//insert a cell in the row
		//var newCell = newRow.insertCell(0);
	
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

		req.open("POST", "http://localhost:3009/insert", true); // on AWS change to 52.36.142.254

		req.setRequestHeader('Content-Type', 'application/json');
		
		req.addEventListener('load', function() {
				populateTable(2);
		});

	    req.send(JSON.stringify(payload));
	    event.preventDefault();
	}); /*end submit data button*/
}
