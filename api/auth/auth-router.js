const router = require('express').Router();
const Users = require('./user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// middleware
const { checkBody, checkUsername, userExists } = require('../middleware/auth-middleware');

router.post('/register', checkBody, checkUsername, async (req, res, next) => {
	/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
	try {
		const { username, password } = req.body;
		const newUser = await Users.add({
			username,
			password: await bcrypt.hash(password, 14)
		});

		res.status(201).json(newUser);
	} catch (err) {
		next(err);
	}
});

router.post('/login', checkBody, userExists, async (req, res, next) => {
	/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
	try {
		const { username, password } = req.body;
		const user = await Users.findBy({ username }).first();

		const token = jwt.sign(
			{
				user_id: user.user_id,
				username: user.username
			},
			process.env.JWT_SECRET
		);

		res.cookie('token', token);
		res.json({
			message: `Welcome, ${user.name}`,
			token: `${token}`
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
