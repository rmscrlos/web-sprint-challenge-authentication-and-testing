const db = require('../../data/dbConfig');

// find all users
const find = () => {
	return db('users').select('user_id', 'username');
};

// find user by ID
const findById = id => {
	return db('users').select('user_id', 'username').where({ id }).first();
};

// add user
const add = async user => {
	const [id] = await db('users').insert(user);
	return findById(id);
};

module.exports = {
	find,
	findById,
	add
};
