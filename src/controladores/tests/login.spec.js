const request = require('supertest');
const app = require('../../index');
const knex = require('../../conexao');
const jwt = require('jsonwebtoken');
const senhaSecreta = require('../../senhaSecreta');
const bcrypt = require('bcrypt');

jest.mock('../../conexao');
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

describe('POST /login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if email or password is missing', async () => {
        const res = await request(app).post('/login').send({ email: '' });

        expect(res.status).toBe(400);
        expect(res.body.mensagem).toBe('Preencha os campos obrigatórios: email e senha');
    });

    it('should return 400 if email is not found', async () => {
        knex.mockReturnValueOnce({
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue(null),
        });

        const res = await request(app).post('/login').send({ email: 'test@test.com', senha: '123456' });

        expect(res.status).toBe(400);
        expect(res.body.mensagem).toBe('email ou senha invalido');
    });

    it('should return 400 if password is invalid', async () => {
        knex.mockReturnValueOnce({
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com', senha: 'hashedpassword' }),
        });

        bcrypt.compare.mockResolvedValue(false);

        const res = await request(app).post('/login').send({ email: 'test@test.com', senha: 'wrongpassword' });

        expect(res.status).toBe(400);
        expect(res.body.mensagem).toBe('email ou senha invalido');
    });

    it('should return 200 and a token if login is successful', async () => {
        knex.mockReturnValueOnce({
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com', senha: 'hashedpassword' }),
        });

        bcrypt.compare.mockResolvedValue(true);

        const res = await request(app).post('/login').send({ email: 'test@test.com', senha: '123456' });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();

        const decoded = jwt.verify(res.body.token, senhaSecreta);
        expect(decoded.id).toBe(1);
    });

    it('should return 500 if there is a server error', async () => {
        knex.mockReturnValueOnce({
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockRejectedValue(new Error('Database error')),
        });

        const res = await request(app).post('/login').send({ email: 'test@test.com', senha: '123456' });

        expect(res.status).toBe(500);
        expect(res.body.mensagem).toBe('ocorreu um erro');
    });
});