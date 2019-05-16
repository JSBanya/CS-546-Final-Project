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


	if(req.session.type == "employer") {
		if(data.employerPassword && data.employerPasswordConfirm) {
			// Update password
			if(data.employerPassword != data.employerConfirmPassword || data.employerPassword.length < 8) {
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

		try {
			await employers.updateEmployerName(req.session._id, data.employerName);
			await employers.updateEmployerDesc(req.session._id, data.employerDescription);

			if(req.file)
				await employers.updateEmployerImg(req.session._id, req.file.filename);
		} catch(e) {
			res.status(500).send(e.toString());
			return;
		}

		res.redirect("/account/" + req.session._id);
		return;
	}

	// Otherwise, candidate
	if(data.candidatePassword && data.candidatePasswordConfirm) {
		// Update password
		if(data.candidatePassword != data.candidateConfirmPassword || data.candidatePassword.length < 8) {
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


	let skills = [];
	if(Array.isArray(data.candidateSkill) && Array.isArray(data.candidateSkillYears)) {
		for(let i = 0; i < data.candidateSkill.length; i++) 
			skills.push({skill: data.candidateSkill[i], years: data.candidateSkillYears[i]});
	} else if(data.candidateSkill && data.candidateSkillYears) {
		skills.push({skill: data.candidateSkill, years: data.candidateSkillYears});
	}

	let experience = [];
	if(Array.isArray(data.candidateExperience) && Array.isArray(data.experienceDescription) && Array.isArray(data.candidateExperienceFrom) && Array.isArray(data.candidateExperienceTo)) {
		for(let i = 0; i < data.candidateExperience.length; i++) 
			experience.push({experience: data.candidateExperience[i], description: data.experienceDescription[i], from: data.candidateExperienceFrom[i], to: data.candidateExperienceTo[i]});
	} else if (data.candidateExperience && data.experienceDescription && data.candidateExperienceFrom && data.candidateExperienceTo) {
		experience.push({experience: data.candidateExperience, description: data.experienceDescription, from: data.candidateExperienceFrom, to: data.candidateExperienceTo});
	}

	let links = [];
	if(Array.isArray(data.candidateLink)) {
		for(let i = 0; i < data.candidateLink.length; i++) 
			links.push(data.candidateLink[i]);
	} else if(data.candidateLink) {
		links.push(data.candidateLink);
	}

	try {
		await candidates.updateCandidateName(req.session._id, data.candidateFirstName, data.candidateLastName);
		await candidates.updateCandidateBio(req.session._id, data.candidateBiography);
		await candidates.updateSkills(req.session._id, skills);
		await candidates.updateExp(req.session._id, experience);
		await candidates.updateLinks(req.session._id, links);

		if(req.file)
			await candidates.updateCandidateImg(req.session._id, req.file.filename);
	} catch(e) {
		res.status(500).send(e.toString());
		return;
	}
	
	res.redirect("/account/" + req.session._id);
	return;
});

module.exports = router;