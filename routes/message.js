const express = require("express");
const router = express.Router();
const candidates = require("../data/candidates");
const employers = require("../data/employers");
const messages = require("../data/messages");

router.post('/', async (req, res) => {
	if(req.session._id === undefined) {
		// Not logged in
		res.redirect("/login");
		return;
	}

	if(req.session.type !== "employer") {
		// Not an employer
		res.redirect("/home");
		return;
	}

	let data = req.body;
	if(!data.title || !data.message || !data.sender || !data.receiver) {
		res.status(400).send("400 - Bad Request (empty field)");
		return;
	}

	if(data.title.length > 50 || data.message.length > 1000) {
		res.status(400).send("400 - Bad Request (bad size)");
		return;
	}

	let recvProfile;
	try {
		recvProfile = await candidates.getCandidateById(data.receiver);
	} catch(e) {
		res.status(400).send(e.toString());
		return;
	}

	try {
		await employers.getEmployerById(data.sender);
	} catch(e) {
		res.status(400).send(e.toString());
		return;
	}

	try {
		await messages.sendMessageToCand(data.receiver.toString(), data.sender.toString(), data.message, data.title);
	} catch(e) {
		res.status(400).send(e.toString());
		return;
	}
	
	res.status(200).send("OK");
});

module.exports = router;