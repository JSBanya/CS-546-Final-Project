function addSkill() {
	let skillID = $(".jobSkillEntry").length;
	let el = `
		<li class="jobSkillEntry" id="jobSkillEntry${skillID}">
			<input type="text" name="jobSkillName" class="formTextInput" placeholder="Skill (e.g. Javascript)" maxlength="30" required>
			<input type="number" name="jobSkillYears" class="formTextInput" placeholder="Years (e.g. 2.5)" step="0.1" min="0.1" max="100" required>
			<button type="button" class="skillRemove" onclick="$('#jobSkillEntry${skillID}').remove()">&#10005;</button>
		</li>
	`;

	$("#jobSkills").append(el);
}