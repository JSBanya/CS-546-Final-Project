let termID = 0;

let showCandidates = true;

$(document).ready(function() {
	addSearchTerm();

	$("#candidatesHeader").click(() => {
		$("#candidates").finish();
		if(showCandidates){
			$("#candidates").slideUp(200);
			showCandidates = false;
		} else {
			$("#candidates").slideDown(200);
			showCandidates = true;
		}
	});
});


function addSearchTerm() {
	let el = `
	<li class="searchTerm" id="searchTerm${termID}">
		<input type="text" name="skill" class="search" placeholder="Skill (e.g. Javascript)" required>
		<input type="number" name="years" class="years" placeholder="Min. Years (e.g. 2.5)" step="0.1" min="0.1" max="100" required>
		<button type="button" class="termRemove" onclick="$('#searchTerm${termID}').remove()">&#10005;</button>
	</li>
	`;
	termID++;
	$("#searchTermsList").append(el);
}