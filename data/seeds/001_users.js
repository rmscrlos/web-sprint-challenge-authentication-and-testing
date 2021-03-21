exports.seed = async function (knex) {
	await knex('users').truncate();
	await knex('users').insert([
		{ name: 'carlos', password: '$2a$14$W4BOFK97UZe/RbHSoeJy7uH03WhoKhr1liotPYWOc3Cq27oW/rw.e' }
	]);
};
