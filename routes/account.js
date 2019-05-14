const express = require("express");
const router = express.Router();
const candidates = require("../data/candidates");
const employers = require("../data/employers");
const bcrypt = require('bcrypt');
const jobs = require("../data/jobs");
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const moment = require("moment");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/../public/images/profile/');
  },
  filename: function (req, file, cb) {
    cb(null, ""+uuidv4()+(file.mimetype == "image/png" ? ".png" : ".jpg"))
  }
});

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


router.get('/:id', async (req, res) => {
	if(req.session._id === undefined) {
		// Not logged in
		res.redirect("/login");
		return;
	}

	let id = req.params.id;
	let isCandidate = false;
	let isEmployer = false;
	let profile;
	try {
		profile = await candidates.getCandidateById(id);
		isCandidate = true;
	} catch(e) { }

	try {
		profile = await employers.getEmployerById(id);
		isEmployer = true;
	} catch(e) { }

	if(!isCandidate && !isEmployer) {
		res.status(404).send("404 - Profile not found")
		return;
	}

	let myProfile;
	try {
		if(req.session.type == "employer") {
			myProfile = await employers.getEmployerById(req.session._id);
		} else {
			myProfile = await candidates.getCandidateById(req.session._id);
		}
	} catch(e) {
		res.status(500).send(e.toString())
		return;
	}

	if(isEmployer) {
		let joblist = [];
		try {
			joblist = await jobs.getJobByOwner(id);
		} catch(e) {
			res.status(500).send(e.toString());
			return;
		}

		// Employer
		res.render('accountEmployer', {
			title: `${profile.name}`, 
			css: ["accountEmployer"], 
			js: ["accountEmployer"], 
			myProfile: myProfile,
			profile: profile,
			joblist: joblist,
			isOwner: (id == req.session._id),
			isEmployer: (req.session.type == "employer" ? true : false),
			layout: "home"
		});
		return;
	}

	// Otherwise, candidate
	res.render('accountCandidate', {
		title: `${profile.firstName} ${profile.lastName}`, 
		css: ["accountCandidate"], 
		js: ["accountCandidate"], 
		myProfile: myProfile,
		profile: profile,
		isOwner: (id == req.session._id),
		isEmployer: (req.session.type == "employer" ? true : false),
		layout: "home"
	});
	return;
});

router.post('/edit', upload.single('profileImage'), async (req, res, next) => {
	if(req.session._id === undefined) {
		// Not logged in
		res.redirect("/login");
		return;
	}

	let data = req.body;
	let isEmpty = (x) => {
		if(x === undefined || x === null || x === "") {
			return true;
		}
		return false;
	};

	if(req.session.type == "employer") {
		if(isEmpty(data.employerName) || data.employerName.length > 50) {
			res.status(400).send("400 - Bad Request (bad employer name)");
			return;
		}

		try {
			await employers.updateEmployerName(req.session._id, data.employerName);
		} catch(e) {
			res.status(500).send(e.toString());
			return;
		}

		if(!isEmpty(data.employerPassword) && !isEmpty(data.employerPasswordConfirm)) {
			// Update password
			if(data.employerPassword != data.employerPasswordConfirm) {
				res.status(400).send("400 - Bad Request (passwords do not match)");
				return;
			}

			let newPassword = bcrypt.hashSync(data.employerPassword, 16);
			try {
				await employers.updateEmployerPassword(req.session._id, newPassword);
			} catch(e) {
				res.status(500).send(e.toString());
				return;
			}
		}

		if(data.employerDescription.length > 500) {
			res.status(400).send("400 - Bad Request (description too long)");
			return;
		} 

		// Update description
		try {
			await employers.updateEmployerDesc(req.session._id, data.employerDescription);
		} catch(e) {
			res.status(500).send(e.toString());
			return;
		}

		if(req.file) {
			// Update image
			try {
				await employers.updateEmployerImg(req.session._id, req.file.filename);
			} catch(e) {
				res.status(500).send(e.toString());
				return;
			}
		}

		res.redirect("/account/" + req.session._id);
		return;
	}

	// Otherwise, candidate
	if(isEmpty(data.candidateFirstName) || isEmpty(data.candidateLastName) || data.candidateFirstName.length > 30 || data.candidateLastName.length > 30) {
		res.status(400).send("400 - Bad Request (bad employer name)");
		return;
	}

	try {
		await candidates.updateCandidateName(req.session._id, data.candidateFirstName, data.candidateLastName);
	} catch(e) {
		res.status(500).send(e.toString());
		return;
	}

	if(!isEmpty(data.candidatePassword) && !isEmpty(data.candidatePasswordConfirm)) {
		// Update password
		if(data.candidatePassword != data.candidatePasswordConfirm) {
			res.status(400).send("400 - Bad Request (passwords do not match)");
			return;
		}

		let newPassword = bcrypt.hashSync(data.candidatePassword, 16);
		try {
			await candidates.updateCandidatePassword(req.session._id, newPassword);
		} catch(e) {
			res.status(500).send(e.toString());
		}
	}

	if(data.candidateBiography.length > 500) {
		res.status(400).send("400 - Bad Request (biography too long)");
		return;
	} 

	try {
		await candidates.updateCandidateBio(req.session._id, data.candidateBiography);
	} catch(e) {
		res.status(500).send(e.toString());
		return;
	}

	if(req.file) {
		// Update image
		try {
			await candidates.updateCandidateImg(req.session._id, req.file.filename);
		} catch(e) {
			res.status(500).send(e.toString());
			return;
		}
	}

	// Update skills
	let skills = [];
	if(Array.isArray(data.candidateSkill) && Array.isArray(data.candidateSkillYears) && data.candidateSkill.length === data.candidateSkillYears.length) {
		for(let i = 0; i < data.candidateSkill.length; i++) {
			if(data.candidateSkill[i].length > 30 || Number(data.candidateSkillYears[i]) == NaN || data.candidateSkillYears[i] < 0.1 || data.candidateSkillYears[i] > 100) {
				res.status(400).send("400 - Bad Request (bad skills)");
				return;
			}
			skills.push({skill: data.candidateSkill[i], years: data.candidateSkillYears[i]});
		}
	} else if(!Array.isArray(data.candidateSkill) && !Array.isArray(data.candidateSkillYears)) {
		if(data.candidateSkill.length > 30 || Number(data.candidateSkillYears) == NaN || data.candidateSkillYears < 0.1 || data.candidateSkillYears > 100) {
				res.status(400).send("400 - Bad Request (bad skills)");
				return;
			}
			skills.push({skill: data.candidateSkill, years: data.candidateSkillYears});
	} else {
		res.status(400).send("400 - Bad Request (bad skills)");
		return;
	}

	try {
		await candidates.updateSkills(req.session._id, skills);
	} catch(e) {
		res.status(500).send(e.toString());
		return;
	}

	// Update Experience
	if(!((Array.isArray(data.candidateExperience) 
		&& Array.isArray(data.experienceDescription) 
		&& Array.isArray(data.candidateExperienceFrom) 
		&& Array.isArray(data.candidateExperienceTo))
		||
		(!Array.isArray(data.candidateExperience) 
		&& !Array.isArray(data.experienceDescription) 
		&& !Array.isArray(data.candidateExperienceFrom) 
		&& !Array.isArray(data.candidateExperienceTo))))
	{
		res.status(400).send("400 - Bad Request (bad experience check)");
		return;
	}

	if(Array.isArray(data.candidateExperience) && !(data.candidateExperience.length === data.experienceDescription.length 
													&& data.experienceDescription.length === data.candidateExperienceFrom.length 
													&& data.candidateExperienceFrom.length === data.candidateExperienceTo.length))
	{
		res.status(400).send("400 - Bad Request (inequal experience field sizes");
		return;
	}

	let experience = [];
	if (Array.isArray(data.candidateExperience)) {
		for(let i = 0; i < data.candidateExperience.length; i++) {
			experience.push({experience: data.candidateExperience[i], description: data.experienceDescription[i], from: data.candidateExperienceFrom[i], to: data.candidateExperienceTo[i]})
		}
	} else {
		experience.push({experience: data.candidateExperience, description: data.experienceDescription, from: data.candidateExperienceFrom, to: data.candidateExperienceTo})
	}

	for(let i = 0; i < experience.length; i++) {
		if(experience[i].experience.length > 50 || experience[i].description.length > 1000) {
			res.status(400).send("400 - Bad Request (bad experience array size check)");
			return;
		}

		if(!moment(experience[i].from).isValid() || !moment(experience[i].to).isValid()) {
			res.status(400).send("400 - Bad Request (invalid experience date)");
			return;
		} else if(experience[i].from > experience[i].to) {
			res.status(400).send("400 - Bad Request (invalid experience date -- From > To)");
			return;
		}
	}

	try {
		await candidates.updateExp(req.session._id, experience);
	} catch(e) {
		res.status(500).send(e.toString());
		return;
	}

	res.redirect("/account/" + req.session._id);
	return;
});

module.exports = router;