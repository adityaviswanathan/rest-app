var userListData = [];

$(document).ready(function() {
	populateTable();
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	$('#btnAddUser').on('click', addUser);
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

function populateTable() {
	console.log("HIT");
	var tableContent = '';
	$.getJSON( '/users/userlist', function(data) {
		userListData = data;
		$.each(data, function() {
			console.log(this.username);
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		}); 
		$('#userList table tbody').html(tableContent);
	});
}

function showUserInfo(event) {
	event.preventDefault();

	var thisUserName = $(this).attr('rel');

	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

	var thisUserObject = userListData[arrayPosition];

	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
};

function addUser(event) {
	event.preventDefault();

	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if($(this).val == '') errorCount++;
	});

	if(errorCount == 0) {
		// If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        $.ajax({
        	type : 'POST',
        	data : newUser,
        	url : '/users/addUser',
        	dataType : 'JSON'
        }).done(function(response) {
        	if(response.msg == '') {
        		$('#addUser fieldset input').val('');
        		populateTable();
        	} else {
        		alert('Error' + response.msg);
        	}
        });
	} else {
		alert('Please fill in all fields');
		return false;
	}
};

function deleteUser(event) {
	event.preventDefault();

	var confirmation = confirm('Are you sure you want to delete this user?');

	if(confirmation) {
		$.ajax({
			type : 'DELETE',
			url : '/users/deleteuser/' + $(this).attr('rel')
		}).done(function(response) {
			if(response.msg == '') {				
			} else {
				alert('Error: ' + response.msg);
			}
			populateTable();
		});		
	} else {
		return false;
	}
};