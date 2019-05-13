const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
	res.render('employerEdit', {title: 'EmployerEdit', css: ["employerEdit"], js: ["employerEdit"]});
});

module.exports = router;