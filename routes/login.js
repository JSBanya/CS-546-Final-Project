const express = require("express");
const router = express.Router();
const candidates = require("../data/candidates");
const employers = require("../data/employers");
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
	res.render('login', {title: 'Log in', css: ["login"], js: ["login"]});
});

router.post('/', async (req, res) => {
	let data = req.body;
	let isEmpty = (x) => {
		if(x === undefined || x === null || x === "") {
			return true;
		}
		return false;
	};

	if(isEmpty(data.email) || isEmpty(data.password)) {
		res.status(400).send("400 - Bad Request (empty required field)");
		return;
	}

	let isCandidate = false;
	let isEmployer = false;
	let profile;
	try {
		profile = await candidates.getCandidateByEmail(data.email);
		isCandidate = true;
	} catch(e) {}

	try {
		profile = await employers.getEmployerByEmail(data.email);
		isEmployer = true;
	} catch(e) {}

	if(!isCandidate && !isEmployer) {
		// No account for the given email
		res.status(401).render('login', {title: 'Log in', css: ["login"], js: ["login"], error: "Invalid email or password"});
		return;
	}
	
	if(!bcrypt.compareSync(data.password, profile.password)) {
		// Invalid password
		res.status(401).render('login', {title: 'Log in', css: ["login"], js: ["login"], error: "Invalid email or password"});
		return;
	}

	// Login valid
	// Create session
	req.session._id = profile._id;
	req.session.type = (isCandidate ? "candidate" : "employer");
	res.redirect("/home");
});

module.exports = router;