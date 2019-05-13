let skillID = 0;
let expID = 0;

$(document).ready(function() {
	addSkill();
	addExperience();
    $("#selectCandidate").click(showCandidate);
    $("#selectEmployer").click(showEmployer);
});

function showCandidate() {
	$("#typePage").hide();
	$("#candidatePage").css("display", "flex");
}

function showEmployer() {
	$("#typePage").hide();
	$("#employerPage").css("display", "flex");
}

function addSkill() {
	let el = `<li class="candidateSkillItem" id="candidateSkill${skillID}">`;
	el += `<input type="text" name="candidateSkill" class="formTextInput skillTextInput candidateSkill" placeholder="Skill (e.g. Javascript)" maxlength="30" required>`
	el += `<input type="number" name="candidateSkillYears" class="formTextInput skillTextInput candidateSkillYears" placeholder="Years (e.g. 2.5)" step="0.1" min="0.1" max="100" required>`
	el += `<button type="button" class="SERemove" onclick="$('#candidateSkill${skillID}').remove()">&#10005;</button>`
	el += "</li>"
	skillID++;
	$("#skillsContainer").append(el);
}

function addExperience() {
	let d = new Date();
	let month = d.getMonth()+1;
	let day = d.getDate();
	if(month < 10) month = "0" + month;
	if(day < 10) day = "0" + day;
	let maxDate = d.getFullYear() + "-" + month  + "-" + day;
	let el = `
	<li class="candidateExperienceItem" id="candidateExperience${expID}">
		<button type="button" class="SERemove candidateExperienceRemove" onclick="$('#candidateExperience${expID}').remove()">&#10005;</button>
		<div class="candidateExperienceContainer">
			<input type="text" name="candidateExperience" class="formTextInput experienceTextInput" placeholder="Location" maxlength="50" required>
			<textarea name="experienceDescription" class="formTextInput experienceDescription" rows=3 placeholder="Job Description" maxlength="1000" required></textarea>
			<span class="formLine">
				<input type="date" name="candidateExperienceFrom" class="formTextInput experienceDate candidateExperienceFrom" max="${maxDate}" required>
				<p class="datesDivider">to</p>
				<input type="date" name="candidateExperienceTo" class="formTextInput experienceDate candidateExperienceTo" max="${maxDate}" required>
			</span>
		</div>
	</li>`;
	expID++;
	$("#experienceContainer").append(el);
}

function alertError(err) {
	$(".error").text(err);
}

function validateCandidateForm() {
	let formData = new FormData(document.querySelector('#candidateForm'));

	let datesFrom = formData.getAll("candidateExperienceFrom");
	let datesTo = formData.getAll("candidateExperienceTo");
	for(let i = 0; i < datesFrom.length; i++) {
		if(datesFrom[i] > datesTo[i]) {
			alertError("Error: Experience start date later than end date.");
			return false;
		}
	}

	let password = formData.get("candidatePassword");
	let password2 = formData.get("candidateConfirmPassword");

	if(password !== password2) {
		alertError("Error: Passwords do not match.");
		return false;
	}

	return true;
}

function validateEmployerForm() {
	let formData = new FormData(document.querySelector('#employerForm'));

	let password = formData.get("employerPassword");
	let password2 = formData.get("employerConfirmPassword");

	if(password !== password2) {
		alertError("Error: Passwords do not match.");
		return false;
	}
}