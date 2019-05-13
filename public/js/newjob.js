let skillID = 0;

$(document).ready(function() {
	addSkill();
});

function addSkill() {
	let el = `<li class="jobSkillItem" id="jobSkill${skillID}">`;
	el += `<input type="text" name="jobeSkill" class="formTextInput skillTextInput" placeholder="Skill (e.g. Javascript)" maxlength="30" required>`
	el += `<input type="number" name="jobSkillYears" class="formTextInput skillNumberInput" placeholder="Years (e.g. 2.5)" step="0.1" min="0.1" max="100" required>`
	el += `<button type="button" class="skillRemove" onclick="$('#jobSkill${skillID}').remove()">&#10005;</button>`
	el += "</li>"
	skillID++;
	$("#jobSkillList").append(el);
}