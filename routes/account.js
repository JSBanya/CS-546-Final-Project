const express = require("express");
const router = express.Router();
const candidates = require("../data/candidates");
const employers = require("../data/employers");
const bcrypt = require('bcrypt');
const jobs = require("../data/jobs");
const multer = require('multer');
const uuidv4 = require('uuid/v4');

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
			profile: profile,
			joblist: joblist,
			isOwner: (id == req.session._id)
		});
		return;
	}

	// Otherwise, candidate
	res.render('accountCandidate', {title: `${profile.firstName} ${profile.lastName}`, css: ["accountCandidate"], js: ["accountCandidate"], profile: profile});
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
			employers.updateEmployerName(req.session._id, data.employerName);
		} catch(e) {
			res.status(500).send(e.toString());
		}

		if(!isEmpty(data.employerPassword) && !isEmpty(data.employerPasswordConfirm)) {
			// Update password
			if(data.employerPassword != data.employerPasswordConfirm) {
				res.status(400).send("400 - Bad Request (passwords do not match)");
				return;
			}

			let newPassword = bcrypt.hashSync(data.employerPassword, 16);
			try {
				employers.updateEmployerPassword(req.session._id, newPassword);
			} catch(e) {
				res.status(500).send(e.toString());
			}
		}

		if(data.employerDescription.length > 500) {
			res.status(400).send("400 - Bad Request (description too long)");
			return;
		} 

		// Update description
		try {
			employers.updateEmployerDesc(req.session._id, data.employerDescription);
		} catch(e) {
			res.status(500).send(e.toString());
		}

		if(req.file) {
			// Update image
			try {
				employers.updateEmployerImg(req.session._id, req.file.filename);
			} catch(e) {
				res.status(500).send(e.toString());
			}
		}

		res.redirect("/account/" + req.session._id);
		return;
	}

	res.redirect("/home");
	return;
});

module.exports = router;