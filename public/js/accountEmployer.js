function alertError(err) {
	$("#error").text(err);
}

function validateEmployerForm() {
	let formData = new FormData(document.querySelector('#mainContent'));

	let password = formData.get("employerPassword");
	let password2 = formData.get("employerPasswordConfirm");

	if((password && !password2) || (!password && password2)) {
		alertError("Error: Must supply both password and password confirmation.");
		return false;
	}

	if(password !== password2) {
		alertError("Error: Passwords do not match.");
		return false;
	}

	return true;
}