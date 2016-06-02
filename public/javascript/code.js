document.addEventListener('DOMContentLoaded', bindButtons);

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

			console.log("object", workoutObject);

			if (popType == 1) {
			var start = 0;
			console.log("poptype 1");
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
				console.log("should run just once");
				for (var val in workoutObject[i]){
					//console.log(workoutObject[i][val]);

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

				} // end outer loop

			} else 
				console.log("Error in network request: " + reqInitial.statusText);
		});
		reqInitial.send(null);
		event.preventDefault();
		//console.log(reqInitial);
}
/* end populate table function */

/* binds event listeners to buttons*/
function bindButtons(){

	populateTable(1);

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
				populateTable(2);
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
