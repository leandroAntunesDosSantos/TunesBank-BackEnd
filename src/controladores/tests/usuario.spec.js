const request = require('supertest');
const app = require('../../index');
const knex = require('../../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../conexao');
jest.mock('bcrypt');

describe('User Controller', () => {
    let token;

    beforeAll(async () => {
        // Mock de um usuário no banco de dados
        const mockUsuario = {
            id: 1,
            nome: 'Test User',
            email: 'testuser@example.com',
            senha: await bcrypt.hash('password123', 10),
            agencia: '001',
            conta: '111111',
            saldo: '0.00',
            data_criacao: '2025-01-22T09:08:29.022Z'
        };

        knex.mockReturnValue({
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue(mockUsuario),
            insert: jest.fn().mockResolvedValue([1])
        });

        bcrypt.compare.mockResolvedValue(true);

        // Fazer login para obter o token
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'testuser@example.com',
                senha: 'password123'
            });

        token = loginResponse.body.token;
    });

    afterAll(async () => {
        jest.clearAllMocks();
    });

    it('should fetch user information', async () => {
        const mockUsuario = {
            id: 1,
            nome: 'Test User',
            email: 'testuser@example.com',
            agencia: '001',
            conta: '111111',
            saldo: '0.00',
            data_criacao: '2025-01-22T09:08:29.022Z'
        };

        knex.mockReturnValue({
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue(mockUsuario)
        });

        const response = await request(app)
            .get('/conta')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            nome: 'Test User',
            email: 'testuser@example.com',
            agencia: '001',
            conta: '111111',
            saldo: '0.00',
            data_criacao: '2025-01-22T09:08:29.022Z'
        });
    });
});