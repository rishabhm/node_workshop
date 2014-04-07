$(document).ready(function () {
	$('#join_group').on('click', function (e) {
		$('.groupno').css('opacity','1')
	})

	$('.groupno').on('keypress', function (e) {
		if (e.keyCode == 13) {
			var group = $(this).val()
			window.location.href = "/join_group?group="+group
		}
	})
})