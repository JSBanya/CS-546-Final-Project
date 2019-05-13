const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
	res.render('login', {title: 'Log in', css: ["login"], js: ["login"]});
});

module.exports = router;