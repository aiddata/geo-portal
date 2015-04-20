 (function() {
	 
	var json = {}, treema;

	var message = {
		"intro":"Welcome to the Mapping Portal Toolbox Editor",
		"load":"JSON has been successfully loaded",
		"load_error":"Error loading data or schema json file",
		"not_valid":"A data entry is not valid",
		"submit":"JSON has been successfully updated",
		"submit_error":"Error updating JSON",
		"bad_pass":"Incorrect password."

	}

	$('#message').html(message.intro);


	$(function() {


		$.when( $.getJSON("toolbox.json"), $.getJSON("schema.json") ).done( function(data, schema){
			
			json.data = data[0]
			json.schema = schema[0]

			if (data[1] == "success"  && schema[1] == "success") {
				var options = { schema:json.schema, data:json.data };
				var el = $("#data");
				// var treema = el.treema(options); 
				treema = TreemaNode.make(el, options);
				treema.build();
				// console.log(treema.data);
				// console.log("treema built");
				$('#message').html(message.load);
			} else {
				console.log("error loading data or schema json file");
				$('#message').html(message.load_error);
			}
		})

	})

	$('#submit button').click(function(){
		console.log("click");

		// check json isValid()
		var isValid = treema.isValid();

		console.log(isValid)
		
		if ( !isValid ) {
			console.log('Not Valid');
			$('#message').html(message.not_valid);
			alert('A data entry is not valid')
			return;
		}


		var confirm = prompt("Confirm update");

		if ( confirm != null && isValid ) {
			var pass;

			$.ajax ({
		      	url: "process.php",
		      	data: {call: "pass", pass: confirm},
		      	dataType: "json",
		      	type: "post",
		      	async: false,
		      	success: function (result) {
			    	console.log("pass check done");
			    	// console.log(result);
					pass = result;
				},
				error: function (result) {
			    	console.log("pass check error");
				}
	    	})

			if ( pass ) {
				$.ajax ({
			      	url: "process.php",
			      	data: {call: "json", json: JSON.stringify(treema.data)},
			      	dataType: "json",
			      	type: "post",
			      	async: false,
			      	success: function (result) {
				    	console.log("toolbox update done");
						$('#message').html(message.submit);
					},
					error: function (result) {
				    	console.log("toolbox update error");
				    	// console.log(result);
						$('#message').html(message.submit_error);				
					}
		    	})

			} else {
				console.log(message.bad_pass);

				$('#message').html(message.bad_pass);				

			}
		}


	})


}).call(this);
