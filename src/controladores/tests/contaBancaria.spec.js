// DESCRIBE - BLOCO DE TESTES
// IT OR TEST - DECLARA UNICO TESTE
// EXPECT - DECLARA O QUE SE ESPERA DE UM TESTE

const ContaBancaria = require('../../controladores/contaBancaria');
const knex = require('../../conexao');
const bcrypt = require('bcrypt');

jest.mock('../../conexao');
jest.mock('bcrypt');

describe('conta bancaria', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('criar conta bancaria com sucesso', async () => {
        const request = {
            body: {
                nome: 'Teste',
                email: 'teste@gmail.com',
                senha: '123456',
            }
        };

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        knex.mockImplementation(() => ({
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue(null),
            insert: jest.fn().mockResolvedValue([1])
        }));

        bcrypt.hash.mockResolvedValue('hashed_password');

        await ContaBancaria.criarContaBancaria(request, response);

        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.json).toHaveBeenCalledWith({ mensagem: 'Conta bancária criada com sucesso.' });
    });

    it('retornar erro se o email já estiver cadastrado', async () => {
        const request = {
            body: {
                nome: 'Teste',
                email: 'teste@gmail.com',
                senha: '123456',
            }
        };

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        knex.mockImplementation(() => ({
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue({ id: 1 })
        }));

        await ContaBancaria.criarContaBancaria(request, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({ mensagem: 'E-mail já cadastrado.' });
    });

    it('retornar erro se não preencher os campos obrigatórios', async () => {
        const request = {
            body: {
                nome: '',
                email: '',
                senha: ''
            }
        };

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await ContaBancaria.criarContaBancaria(request, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({ mensagem: 'Preencha os campos obrigatórios: nome, email e senha.' });
    });
});