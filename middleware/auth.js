const candidates = require("../data/candidates");

const auth = async (req, res, next) => {
  	try {
		let c = await candidates.getCandidateBySession(req.sessionID);

		// Candidate is logged in
		res.redirect("/home")
		return;
	} catch(e) { 
		next()
	}
}

module.exports = auth;