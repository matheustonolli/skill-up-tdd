import { describe, it, expect, beforeEach } from 'vitest';
import * as hashtagService from '../hashtag.service.js';

describe('Hashtag Service', () => {
  let mockHashtagModel;

  beforeEach(() => {
    mockHashtagModel = {
      findOne: vi.fn(),
      findAll: vi.fn(),
      create: vi.fn(),
      destroy: vi.fn()
    };
  });

  describe('createHashtag()', () => {
    it('deve criar hashtag com dados válidos', async () => {
      mockHashtagModel.findOne.mockResolvedValueOnce(null);
      mockHashtagModel.create.mockResolvedValueOnce({ id: 1, name: 'javascript', videoId: 1 });

      const result = await hashtagService.createHashtag({ name: '#JavaScript', videoId: 1 }, mockHashtagModel);

      expect(result.message).toBe('Hashtag criada com sucesso!');
      expect(result.hashtag.name).toBe('javascript');
    });

    it('deve remover o # e deixar em minúsculo automaticamente', async () => {
      mockHashtagModel.findOne.mockResolvedValueOnce(null);
      mockHashtagModel.create.mockResolvedValueOnce({ id: 1, name: 'react', videoId: 1 });

      const result = await hashtagService.createHashtag({ name: '#React', videoId: 1 }, mockHashtagModel);
      expect(result.hashtag.name).toBe('react');
    });

    it('deve lançar erro se o nome estiver vazio', async () => {
      await expect(
        hashtagService.createHashtag({ name: '', videoId: 1 }, mockHashtagModel)
      ).rejects.toThrow('O nome da hashtag não pode estar vazio.');
    });

    it('deve lançar erro se o nome tiver mais de 100 caracteres', async () => {
      await expect(
        hashtagService.createHashtag({ name: 'a'.repeat(101), videoId: 1 }, mockHashtagModel)
      ).rejects.toThrow('A hashtag deve ter no máximo 100 caracteres.');
    });

    it('deve lançar erro se o nome contiver espaços', async () => {
      await expect(
        hashtagService.createHashtag({ name: 'java script', videoId: 1 }, mockHashtagModel)
      ).rejects.toThrow('A hashtag não pode conter espaços.');
    });

    it('deve lançar erro se o videoId não for informado', async () => {
      await expect(
        hashtagService.createHashtag({ name: 'node' }, mockHashtagModel)
      ).rejects.toThrow('Vídeo não informado.');
    });

    it('deve lançar erro se a hashtag já existir', async () => {
      mockHashtagModel.findOne.mockResolvedValueOnce({ id: 1, name: 'node' });

      await expect(
        hashtagService.createHashtag({ name: 'node', videoId: 1 }, mockHashtagModel)
      ).rejects.toThrow('Essa hashtag já existe.');
    });
  });

  describe('deleteHashtag()', () => {
    it('deve remover hashtag existente', async () => {
      mockHashtagModel.findOne.mockResolvedValueOnce({ id: 1, name: 'node' });
      mockHashtagModel.destroy.mockResolvedValueOnce(1);

      const result = await hashtagService.deleteHashtag(1, mockHashtagModel);
      expect(result.message).toBe('Hashtag removida com sucesso!');
    });

    it('deve lançar erro se o id não for informado', async () => {
      await expect(hashtagService.deleteHashtag(null, mockHashtagModel)).rejects.toThrow('Hashtag não informada.');
    });

    it('deve lançar erro se a hashtag não existir', async () => {
      mockHashtagModel.findOne.mockResolvedValueOnce(null);
      await expect(hashtagService.deleteHashtag(99, mockHashtagModel)).rejects.toThrow('Hashtag não encontrada.');
    });
  });

  describe('listHashtagsByVideo()', () => {
    it('deve retornar lista de hashtags do vídeo', async () => {
      mockHashtagModel.findAll.mockResolvedValueOnce([
        { id: 1, name: 'node', videoId: 1 },
        { id: 2, name: 'express', videoId: 1 }
      ]);

      const result = await hashtagService.listHashtagsByVideo(1, mockHashtagModel);
      expect(result.hashtags).toHaveLength(2);
    });

    it('deve lançar erro se o videoId não for informado', async () => {
      await expect(hashtagService.listHashtagsByVideo(null, mockHashtagModel)).rejects.toThrow('Vídeo não informado.');
    });
  });
});