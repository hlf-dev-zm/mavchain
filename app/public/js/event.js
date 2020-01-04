'use strict';

function showProgress() {
    $('.display-loader').addClass('show');
}

function hideProgress() {
    $('.display-loader').removeClass('show');
}

function generateHash() {
    // Show Progress untill the task is complete
    showProgress();

    // Get the attributes from the UI i.e College Name
    let info1 = document.getElementById('info1').value;
    let info2 = document.getElementById('info2').value;
    let info3 = document.getElementById('info3').value;

    let str=''
    // Set the Payload for the Post restapi call
    let options = { 'info1': info1, 'info2': info2, 'info3': info3 };
    {
        // Use Async ajax call to post a request to the Client App
        $.when($.post('/generateHash/', options)).done(function (res) {

            // End progress display
            hideProgress();

            str += '<p style="color: rgb(5, 67, 124)">'+res.hash+'</p>'
            sessionStorage.setItem("hash_display",str)
            // Update the UI with college list
            document.getElementById('hash_value').innerHTML = str;

        });
    }
}

function getHashStatus() {
    // Show Progress untill the task is complete
    showProgress();

    // Get the attributes from the UI i.e College Name
    let hash = document.getElementById('hash_query').value;

    let str=''
    // Set the Payload for the Post restapi call
    let options = { 'hash': hash };
    {
        // Use Async ajax call to post a request to the Client App
        $.when($.post('/getHashStatus', options)).done(function (res) {

            // End progress display
            hideProgress();

            str += '<pre>'+JSON.stringify(res.status, undefined, 2)+'</pre>'
                     
            // Update the UI with college list
            document.getElementById('query_result').innerHTML = str;

        });
    }
}

function verifyHash(party_name) {
	// Show Progress untill the task is complete
	showProgress();

	// Get the attributes from the UI i.e College Name
	let hash = document.getElementById("hash_verify_" + party_name).value;

	let str = "";
	// Set the Payload for the Post restapi call
	let options = { hash: hash };
	{
		// Use Async ajax call to post a request to the Client App
		$.when($.post("/verifyHash", options)).done(function(res) {
			// End progress display
            hideProgress();
            console.log(res)
            let yes_select = '';
            let no_select = '';
			if (res.status == "YES") {
				yes_select = ' selected="selected"';
			} else {
				no_select = ' selected="selected"';
            }
            let color = res.status == "YES" ? "green" : "red";
			// str += '<span style="color: '+color+'"><p style="font-size: 10px" id="hash_status_'+party_name+'">'+res.status+'</p>'
			str +=
				'<p><select class="'+color+'Text" id="hash_status_' +
				party_name +
				'" onchange="this.className=this.options[this.selectedIndex].className"> \
            <option value="YES" class="greenText"' +
				yes_select +
				'>YES</option> \
            <option value="NO" class="redText"' +
				no_select +
				'>NO</option> \
            </select></p>';
			// Update the UI with college list
			document.getElementById("verify_hash_result_" + party_name).innerHTML = str;
		});
	}
}

function updateHashStatus(party_name){

    // Show Progress untill the task is complete
    showProgress();

    // Get the attributes from the UI i.e College Name
    let hash = document.getElementById('hash_verify_'+party_name).value;
    let status = document.getElementById('hash_status_'+party_name).value;

    let str=''
    // Set the Payload for the Post restapi call
    let options = { 'hash': hash,'party_id': party_name, 'status':status };
    {
        // Use Async ajax call to post a request to the Client App
        $.when($.post('/updateHashStatus', options)).done(function (res) {

            // End progress display
            hideProgress();

            str += '<p style="font-size: 20px font-colour: green"> Updated in the Chain ! </p>'
            // Update the UI with college list
            document.getElementById('update_status_'+party_name).innerHTML = str;

        });
    }
}