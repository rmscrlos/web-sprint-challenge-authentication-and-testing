const Users = require('../auth/user-model');
const bcrypt = require('bcryptjs');

// checks if body is being send
const checkBody = (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(400).json({
			message: 'Username and password required.'
		});
	}
	next();
};

// checks if username is valid
const checkUsername = async (req, res, next) => {
	try {
		const { username } = req.body;
		const user = await Users.findBy({ username }).first();

		if (user) {
			return res.status(409).json({
				message: 'Username taken.'
			});
		}
		next();
	} catch (err) {
		next(err);
	}
};

// checks if user exists
const userExists = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.findBy({ username }).first();

		const passwordValid = await bcrypt.compare(password, user.password);

		if (!user || !passwordValid) {
			return res.status(401).json({
				message: 'Invalid Credentials'
			});
		}
		next();
	} catch (err) {
		next(err);
	}
};

module.exports = {
	checkBody,
	checkUsername,
	userExists
};
