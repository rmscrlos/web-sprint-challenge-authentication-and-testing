const supertest = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

beforeEach(async () => {
	await db.seed.run();
});

beforeAll(async () => {
	await db.migrate.rollback();
	await db.migrate.latest();
});

afterAll(async () => {
	await db.destroy();
});

// Write your tests here
test('sanity', () => {
	expect(true).toBe(true);
});

describe('Auth endpoints', () => {
	it('register a user', async () => {
		const res = await supertest(server).post('/api/auth/register').send({
			username: 'carlos',
			password: 'hello'
		});
		expect(res.statusCode).toBe(201);
		expect(res.type).toBe('application/json');
		expect(res.body.username).toBe('carlos');
	});
	it('username is taken!', async () => {
		const res = await supertest(server).post('/api/auth/register').send({
			username: 'carlos',
			password: 'hello'
		});
		expect(res.statusCode).toBe(409);
		expect(res.type).toBe('application/json');
		expect(res.body.message).toBe('Username is taken');
	});
	it('Token recieved on login', async () => {
		const res = await supertest(server).post('/api/auth/login').send({
			username: 'carlos',
			password: 'hello'
		});

		expect(res.statusCode).toBe(200);
		expect(res.type).toBe('application/json');
		expect(res.body.token).toBeDefined();
	});

	it('invalid credentials', async () => {
		const res = await supertest(server).post('/api/auth/login').send({
			username: 'carsa',
			password: 'dadfa'
		});
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe('invalid credentials');
	});
});

describe('Jokes endpoint testing', () => {
	it('gets all jokes with token', async () => {
		const {
			body: { token }
		} = await supertest(server).post('/api/auth/login').send({
			username: 'carlos',
			password: 'hello'
		});

		const res = await supertest(server).get('/api/jokes').set('authorization', token);
		expect(res.statusCode).toBe(200);
		expect(res.type).toBe('application/json');
		expect(res.body[0].id).toBe('0189hNRf2g');
	});

  it('[4]jokes denied on bad login', async ()=>{
    //try grabbing jokes using the token            
    const res = await supertest(server)
        .get('/api/jokes')
        .set('authorization', "asdafdsfs")
    expect(res.statusCode).toBe(401)
    expect(res.type).toBe('application/json')
    expect(res.body.message).toBe('Token invalid.')
});
