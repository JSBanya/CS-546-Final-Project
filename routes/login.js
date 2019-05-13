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

	try {
		let c = await candidates.getCandidateByEmail(data.email);
		if(!bcrypt.compareSync(data.password, c.password)) {
			// Invalid password
			res.status(401).render('login', {title: 'Log in', css: ["login"], js: ["login"]});
			return;
		}

		// Login valid
		// Create session
		try {
			await candidates.addCandidateSession(c._id, req.sessionID);
		} catch(e) {
			res.status(500).render('login', {title: 'Log in', css: ["login"], js: ["login"]});
			return;
		}

		res.redirect("/home");
		return;
	} catch(e) {
		console.log(e);
	}
	

	res.render('login', {title: 'Log in', css: ["login"], js: ["login"]});
});

module.exports = router;