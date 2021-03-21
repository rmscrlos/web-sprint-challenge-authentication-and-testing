const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets');

module.exports = async (req, res, next) => {
	try {
		const token = req.cookies.token;

		if (!token) {
			return res.status(401).json({
				message: 'Token required.'
			});
		}

		jwt.verify(token, process.env.SECRET, (err, decoded) => {
			if (err) {
				return res.status(401).json({
					message: 'Token invalid.'
				});
			}

			req.token = decoded;

			next();
		});

		next();
	} catch (err) {
		next(err);
	}
	/*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
