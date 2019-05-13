const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
	res.render('create', {title: 'Create An Account', css: ["create"], js: ["create"]});
});

router.post('/', async (req, res) => {
	console.log(req.body);
	res.redirect("/");
});

module.exports = router;