var socket = io.connect('/'),
	user_name = "",
	group_id = ""

$(document).ready(function () {

	user_name = prompt("Please enter your name")
	group_id = $('.heading').attr('group_id')

	socket.emit("join_group", {group_id : group_id, user_name : user_name})
	socket.on("join_group_done", function (data) {
		displayNewUser(data.user_name)
	})

	$('.submit').on('click', function (e) {
		sendMessage()
	})

	$('input.msg').on('keypress', function (e) {
		if (e.keyCode == 13) {
			e.preventDefault()
			sendMessage()
		}
	})

	socket.on("recMsg", function (data) {
		displayMessage(data.user_name, data.message)
	})

})

function displayNewUser(user) {
	$('.group_messages').append("<div class='new_user'><i>" + user + " has joined the group</i></div>")
}

function displayMessage(user, msg) {
	$('.group_messages').append("<div class='new_msg'><span class='user'>"+user+"</span> : <span class='msg_body'>" + msg + "</span></div>")
}

function sendMessage() {
	var msg = $('input.msg').val()
	socket.emit("sending_msg", {user_name : user_name, msg : msg, group_id : group_id})
	$('input.msg').val("")
}
