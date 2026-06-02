import { describe, it, expect, beforeEach } from 'vitest';
import * as userService from '../user.service.js';

vi.mock('bcryptjs', () => ({
  default: { hash: vi.fn().mockResolvedValue('hashed_password') }
}));

describe('User Service', () => {
  let mockUserModel;

  beforeEach(() => {
    mockUserModel = {
      findOne: vi.fn(),
      create: vi.fn(),
      destroy: vi.fn()
    };
  });

  describe('createUser()', () => {
    it('deve criar usuário com dados válidos', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null);
      mockUserModel.create.mockResolvedValueOnce({ id: 1, name: 'João', email: 'joao@email.com' });

      const result = await userService.createUser(
        { name: 'João', email: 'joao@email.com', password: '123456' },
        mockUserModel
      );

      expect(result.message).toBe('Usuário criado com sucesso!');
      expect(result.user).toHaveProperty('id');
    });

    it('deve lançar erro se o nome estiver vazio', async () => {
      await expect(
        userService.createUser({ name: '', email: 'joao@email.com', password: '123456' }, mockUserModel)
      ).rejects.toThrow('O nome não pode estar vazio.');
    });

    it('deve lançar erro se o e-mail estiver vazio', async () => {
      await expect(
        userService.createUser({ name: 'João', email: '', password: '123456' }, mockUserModel)
      ).rejects.toThrow('O e-mail não pode estar vazio.');
    });

    it('deve lançar erro se o e-mail for inválido', async () => {
      await expect(
        userService.createUser({ name: 'João', email: 'invalido', password: '123456' }, mockUserModel)
      ).rejects.toThrow('E-mail inválido.');
    });

    it('deve lançar erro se a senha tiver menos de 6 caracteres', async () => {
      await expect(
        userService.createUser({ name: 'João', email: 'joao@email.com', password: '123' }, mockUserModel)
      ).rejects.toThrow('A senha deve ter no mínimo 6 caracteres.');
    });

    it('deve lançar erro se o e-mail já estiver cadastrado', async () => {
      mockUserModel.findOne.mockResolvedValueOnce({ id: 1 });

      await expect(
        userService.createUser({ name: 'João', email: 'joao@email.com', password: '123456' }, mockUserModel)
      ).rejects.toThrow('E-mail já cadastrado.');
    });

    it('não deve retornar a senha no resultado', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null);
      mockUserModel.create.mockResolvedValueOnce({ id: 1, name: 'João', email: 'joao@email.com' });

      const result = await userService.createUser(
        { name: 'João', email: 'joao@email.com', password: '123456' },
        mockUserModel
      );

      expect(result.user).not.toHaveProperty('password');
    });
  });

  describe('deleteUser()', () => {
    it('deve excluir usuário existente', async () => {
      mockUserModel.findOne.mockResolvedValueOnce({ id: 1 });
      mockUserModel.destroy.mockResolvedValueOnce(1);

      const result = await userService.deleteUser(1, mockUserModel);
      expect(result.message).toBe('Usuário excluído com sucesso!');
    });

    it('deve lançar erro se userId não for informado', async () => {
      await expect(userService.deleteUser(null, mockUserModel)).rejects.toThrow('Usuário não informado.');
    });

    it('deve lançar erro se o usuário não existir', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null);

      await expect(userService.deleteUser(99, mockUserModel)).rejects.toThrow('Usuário não encontrado.');
    });
  });
});