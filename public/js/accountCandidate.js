function addSkill() {
	let skillID = $(".skillEntry").length;
	let el = `
		<li class="skillEntry" id="candidateSkill${skillID}">
			<div class="skillEntryContainer">
				<input type="text" name="candidateSkill" class="formTextInput skillNameEdit" placeholder="Skill (e.g. Javascript)" maxlength="30" required>
				<input type="number" name="candidateSkillYears" class="formTextInput skillYearsEdit" placeholder="Years (e.g. 2.5)" step="0.1" min="0.1" max="100" required>
				<button type="button" class="SERemove" onclick="$('#candidateSkill${skillID}').remove()">&#10005;</button>
			</div>
		</li>
	`;

	$("#skillsContainer").append(el);
}

function addExperience() {
	let experienceID = $(".experienceEntryContainerEdit").length;
	let el = `
	<div class="experienceEntryRow" id="candidateExperience${experienceID}">
		<button type="button" class="SERemove" onclick="$('#candidateExperience${experienceID}').remove()">&#10005;</button>
		<div class="experienceEntryContainerEdit">
			<input type="text" name="candidateExperience" class="formTextInput" placeholder="Location" maxlength="50" required>
			<textarea name="experienceDescription" class="formTextInput experienceDescriptionEdit" rows=3 placeholder="Job Description" maxlength="1000" required></textarea>
			<div class="experienceEntryRow">
				<input type="date" name="candidateExperienceFrom" class="formTextInput experienceDate candidateExperienceFrom" required>
				<p class="datesDivider">to</p>
				<input type="date" name="candidateExperienceTo" class="formTextInput experienceDate candidateExperienceTo" required>
			</div>
		</div>
	</div>
	`;

	$("#experienceContainer").append(el);
}

function addLink() {
	let linkID = $(".candidateLinkItem").length;
	let el = `
	<li class="candidateLinkItem" id="candidateLinkItem${linkID}">
		<input type="url" name="candidateLink" class="formTextInput linkTextInput" placeholder="A website" maxlength="100" required>
		<button type="button" class="SERemove" onclick="$('#candidateLinkItem${linkID}').remove()">&#10005;</button>
	</li>
	`;

	$("#linksContainer").append(el);
}

function alertError(err) {
	$("#error").text(err);
}

function validateCandidateForm() {
	let formData = new FormData(document.querySelector('#mainContent'));

	let d = new Date();
	let month = d.getMonth()+1;
	let day = d.getDate();
	if(month < 10) month = "0" + month;
	if(day < 10) day = "0" + day;
	let maxDate = d.getFullYear() + "-" + month  + "-" + day;

	let datesFrom = formData.getAll("candidateExperienceFrom");
	let datesTo = formData.getAll("candidateExperienceTo");
	for(let i = 0; i < datesFrom.length; i++) {
		if(datesFrom[i] > datesTo[i]) {
			alertError("Error: Experience start date later than end date.");
			return false;
		}

		if(datesFrom[i] > maxDate || datesTo[i] > maxDate) {
			alertError("Error: Experience date later than current date.");
			return false;
		}
	}

	let password = formData.get("candidatePassword");
	let password2 = formData.get("candidateConfirmPassword");

	if((password && !password2) || (!password && password2)) {
		alertError("Error: Must supply both password and password confirmation.");
		return false;
	}

	if((password && password2) && password !== password2) {
		alertError("Error: Passwords do not match.");
		return false;
	}

	return true;
}

function enableModal() {
	$("#modalOuter").css("display", "flex");
}

function disableModal() {
	$("#modalOuter").css("display", "none");
}

function sendMessage() {
	let formData = new FormData(document.querySelector('#messageContent'));
	const data = new URLSearchParams();
	for (const pair of formData) {
	    data.append(pair[0], pair[1]);
	}

	fetch("/message", {
   		method: 'post',
    	body: data,
	}).then((response) => {
		if(response.ok) {
			$("#modalOuter").css("display", "none");
			$("#titleInput").val("");
			$("#message").val("");
		}
	});

	return false;
}