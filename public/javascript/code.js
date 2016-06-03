document.addEventListener('DOMContentLoaded', bindButtons);
document.addEventListener('DOMContentLoaded', populateTable(1));


/* Clear table function */
function clearTable(){
	var parent = document.getElementById('ex-table');
	var child = document.getElementById('table-body');
	parent.removeChild(child);

	// re-add table body
	newTableBody = document.createElement('tbody')
	newTableBody.id = "table-body";
	parent.appendChild(newTableBody);
} /* end clear table function */


 /* delete row function */
function deleteRow(id) {
	//var deleteThis = id; // gets sent to server
	//console.log(deleteThis);

	var payload = {	id };
	//console.log(payload);
	var deleteRequest = new XMLHttpRequest();
	
	deleteRequest.open("POST", "http://localhost:3009/delete-row", true); // change address
	deleteRequest.setRequestHeader('Content-Type', 'application/json');
	deleteRequest.addEventListener('load', function(event){
		//clearTable();
		populateTable(1);
	});
	deleteRequest.send(JSON.stringify(payload));
	event.preventDefault();
};
/* end delete row function */
/*
function updateRow(id){
	var payload = {	id };
	//console.log(payload);
	var deleteRequest = new XMLHttpRequest();
	
	deleteRequest.open("GET", "http://localhost:3009/update-row?id="+payload.id, true); // change address
	deleteRequest.setRequestHeader('Content-Type', 'application/json');
	deleteRequest.addEventListener('load', function(event){
		//clearTable();
		//populateTable(1);
	});
	deleteRequest.send(null);
	//deleteRequest.send(JSON.stringify(payload));
	console.log("update payload", payload);
	event.preventDefault();
};
*/
/*
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
			//console.log("initial populating", responseInitial);

			//populate table initial
			var workoutObject = responseInitial; // workout server response
			//console.log(workoutObject);
			console.log("length of workout object", workoutObject.length);

			console.log("objects inside", workoutObject);

			if (popType == 1) {
			var start = 0;
			//console.log("poptype 1");
			}
			else if (popType == 2) {
			var start = workoutObject.length - 1;
			console.log("val start", start)
			console.log("poptype 2", workoutObject[start]);
			console.log("new length", workoutObject.length);
			}
			//loop to populate table
			var table = document.getElementById("table-body");
			for (var i = start; i<workoutObject.length; i++){
				var isId = true;
				var isUnit = 1;
				var newRow = table.insertRow(0);
				//console.log("should run just once");
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
					
					var cellButton = document.createElement('td');
					var deleteButton = document.createElement('button');
					deleteButton.class = "button-primary";
					//deleteButton.style = "marigin-bottom:0rem";
					deleteButton.id = workoutObject[i].id;
					deleteButton.textContent = "delete";
					deleteButton.setAttribute("onclick", "deleteRow(this.id)")
					newRow.appendChild(cellButton.appendChild(deleteButton));

					var cellButton2 = document.createElement('td');
					var updateButton = document.createElement('button');
					updateButton.class = "button-primary";
					updateButton.id = workoutObject[i].id;
					updateButton.textContent = "update";
					updateButton.action
					//updateButton.href = "http://localhost.com/update-row/update-rowid="+updateButton.id;
					//updateButton.setAttribute("onclick", "updateRow(this.id)");
					updateButton.setAttribute("onclick", "window.location='update-row?id='+this.id;");

					// <a href="update-row?id={{this.id}}">
					// or updateButton.href = "/edit-entry?id="+updateButton.id
					newRow.appendChild(cellButton2.appendChild(updateButton));
				} // end outer loop

			} else 
				console.log("Error in network request: " + reqInitial.statusText);
		});
		reqInitial.send(null);
		//event.preventDefault();
		//console.log(reqInitial);
}
/* end populate table function */

/* binds event listeners to buttons*/
function bindButtons(){

	/*submit data button*/
	if (document == null){
		console.log("document is null");
	}
	if (document.getElementById('submit-data') == null){
		console.log("submit-data is null");
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
				populateTable(2);
		});

	    req.send(JSON.stringify(payload));
	    event.preventDefault();
	}); /*end submit data button*/
}
