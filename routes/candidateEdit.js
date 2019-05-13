const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
	res.render('candidateEdit', {title: 'CandidateEdit', css: ["candidateEdit"], js: ["candidateEdit"]});
});

module.exports = router;