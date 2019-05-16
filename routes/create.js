const express = require("express");
const router = express.Router();
const moment = require("moment");
const candidates = require("../data/candidates");
const employers = require("../data/employers");
const bcrypt = require('bcrypt');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/../public/images/profile/');
  },
  filename: function (req, file, cb) {
    cb(null, ""+uuidv4()+(file.mimetype == "image/png" ? ".png" : ".jpg"))
  }
})
 
var upload = multer({ 
	storage: storage,
	limits: { 
		fileSize: 1024 * 1024, //bytes 
		files: 1,
	},
	fileFilter: (req, file, cb) => {
		if(file.mimetype != "image/png" && file.mimetype != "image/jpeg") {
			cb(null, false);
		} else {
			cb(null, true);
		}
	}
});


router.get('/', async (req, res) => {
	res.render('create', {title: 'Create An Account', css: ["create"], js: ["create"]});
});

router.post('/candidate', upload.single('profileImage'), async (req, res, next) => {
	let data = req.body;
	if(!data.candidatePassword || !data.candidateConfirmPassword || data.candidatePassword != data.candidateConfirmPassword || data.candidatePassword.length < 8) {
		res.status(400).send("400 - Bad password");
		return;
	}

	// Check if email is already in use
	try {
		let c = await candidates.getCandidateByEmail(data.candidateEmail.toLowerCase());
		let e = await employers.getEmployerByEmail(data.candidateEmail.toLowerCase());
		if(c || e) {
			res.status(400).send("Email already in use");
			return;
		}
	} catch(e) {
		res.status(500).send(e.toString());
		return;
	}

	let newCandidate = {};
	newCandidate.firstName = data.candidateFirstName;
	newCandidate.lastName = data.candidateLastName;
	newCandidate.email = data.candidateEmail.toLowerCase();
	newCandidate.password = bcrypt.hashSync(data.candidatePassword, 16);
	newCandidate.biography = data.candidateBiography;
	
	newCandidate.skills = [];
	if(Array.isArray(data.candidateSkill) && Array.isArray(data.candidateSkillYears)) {
		for(let i = 0; i < data.candidateSkill.length; i++) 
			newCandidate.skills.push({skill: data.candidateSkill[i], years: data.candidateSkillYears[i]});
	} else if(data.candidateSkill && data.candidateSkillYears) {
		newCandidate.skills.push({skill: data.candidateSkill, years: data.candidateSkillYears});
	}

	newCandidate.experience = [];
	if(Array.isArray(data.candidateExperience) && Array.isArray(data.experienceDescription) && Array.isArray(data.candidateExperienceFrom) && Array.isArray(data.candidateExperienceTo)) {
		for(let i = 0; i < data.candidateExperience.length; i++) 
			newCandidate.experience.push({experience: data.candidateExperience[i], description: data.experienceDescription[i], from: data.candidateExperienceFrom[i], to: data.candidateExperienceTo[i]});
	} else if (data.candidateExperience && data.experienceDescription && data.candidateExperienceFrom && data.candidateExperienceTo) {
		newCandidate.experience.push({experience: data.candidateExperience, description: data.experienceDescription, from: data.candidateExperienceFrom, to: data.candidateExperienceTo});
	}

	newCandidate.links = [];
	if(Array.isArray(data.candidateLink)) {
		for(let i = 0; i < data.candidateLink.length; i++) 
			newCandidate.links.push(data.candidateLink[i]);
	} else if(data.candidateLink) {
		newCandidate.links.push(data.candidateLink);
	}

	if(!req.file) {
		newCandidate.profileImage = "default.png";
	} else {
		newCandidate.profileImage = req.file.filename;
	}

	try {
		await candidates.addCandidate(newCandidate);
	} catch(e) {
		res.status(400).send(`400 - Bad candidate: ${e.toString()}`);
		return;
	}

	console.log("New candidate:")
	console.log(newCandidate);

	res.status(200).redirect("/login");
});

router.post('/employer', upload.single('profileImage'), async (req, res, next) => {
	let data = req.body;
	if(!data.employerPassword || !data.employerConfirmPassword || data.employerPassword != data.employerConfirmPassword || data.employerPassword.length < 8) {
		res.status(400).send("400 - Bad password");
		return;
	}

	// Check if email is already in use
	try {
		let c = await candidates.getCandidateByEmail(data.employerEmail.toLowerCase());
		let e = await employers.getEmployerByEmail(data.employerEmail.toLowerCase());
		if(c || e) {
			res.status(400).send("Email already in use");
			return;
		}
	} catch(e) {
		res.status(500).send(e.toString());
		return;
	}

	let newEmployer = {};
	newEmployer.name = data.employerName;
	newEmployer.email = data.employerEmail.toLowerCase();
	newEmployer.password = bcrypt.hashSync(data.employerPassword, 16);
	newEmployer.description = data.employerDescription;

	if(!req.file) {
		newEmployer.profileImage = "default.png";
	} else {
		newEmployer.profileImage = req.file.filename;
	}

	try {
		await employers.addEmployer(newEmployer);
	} catch(e) {
		res.status(400).send(`400 - Bad employer: ${e.toString()}`);
		return;
	}


	console.log("New employer:")
	console.log(newEmployer);

	res.redirect("/login");
});

module.exports = router;