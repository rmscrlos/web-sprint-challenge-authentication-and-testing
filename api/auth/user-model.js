const db = require('../../data/dbConfig');

// find all users
const find = () => {
	return db('users').select('id', 'username');
};

const findBy = filter => {
	return db('users').select('id', 'username', 'password').where(filter);
};

// find user by ID
const findById = id => {
	return db('users').select('id', 'username', 'password').where({ id }).first();
};

// add user
const add = async user => {
	const [id] = await db('users').insert(user);
	return findById(id);
};

module.exports = {
	find,
	findBy,
	findById,
	add
};
