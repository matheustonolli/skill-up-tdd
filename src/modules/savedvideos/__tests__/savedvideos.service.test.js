import { describe, it, expect, beforeEach } from 'vitest';
import * as savedVideoService from '../savedvideos.service.js';

describe('SavedVideo Service', () => {
  let mockSavedVideoModel;

  beforeEach(() => {
    mockSavedVideoModel = {
      findOne: vi.fn(),
      findAll: vi.fn(),
      create: vi.fn(),
      destroy: vi.fn()
    };
  });

  describe('saveVideo()', () => {
    it('deve salvar vídeo com dados válidos', async () => {
      mockSavedVideoModel.findOne.mockResolvedValueOnce(null);
      mockSavedVideoModel.create.mockResolvedValueOnce({ id: 1, userId: 1, videoId: 1 });

      const result = await savedVideoService.saveVideo({ userId: 1, videoId: 1 }, mockSavedVideoModel);

      expect(result.message).toBe('Vídeo salvo com sucesso!');
      expect(result.savedVideo).toHaveProperty('id');
    });

    it('deve lançar erro se o vídeo já estiver salvo', async () => {
      mockSavedVideoModel.findOne.mockResolvedValueOnce({ id: 1 });

      await expect(
        savedVideoService.saveVideo({ userId: 1, videoId: 1 }, mockSavedVideoModel)
      ).rejects.toThrow('Vídeo já está salvo.');
    });
  });

  describe('unsaveVideo()', () => {
    it('deve remover vídeo dos salvos', async () => {
      mockSavedVideoModel.findOne.mockResolvedValueOnce({ id: 1, userId: 1, videoId: 1 });
      mockSavedVideoModel.destroy.mockResolvedValueOnce(1);

      const result = await savedVideoService.unsaveVideo({ userId: 1, videoId: 1 }, mockSavedVideoModel);
      expect(result.message).toBe('Vídeo removido dos salvos com sucesso!');
    });

    it('deve lançar erro se userId não for informado', async () => {
      await expect(
        savedVideoService.unsaveVideo({ videoId: 1 }, mockSavedVideoModel)
      ).rejects.toThrow('Usuário não autenticado.');
    });

    it('deve lançar erro se o vídeo não estiver nos salvos', async () => {
      mockSavedVideoModel.findOne.mockResolvedValueOnce(null);

      await expect(
        savedVideoService.unsaveVideo({ userId: 1, videoId: 99 }, mockSavedVideoModel)
      ).rejects.toThrow('Vídeo não encontrado nos salvos.');
    });
  });

  describe('listSavedVideos()', () => {
    it('deve retornar lista de vídeos salvos', async () => {
      mockSavedVideoModel.findAll.mockResolvedValueOnce([
        { id: 1, userId: 1, videoId: 2 },
        { id: 2, userId: 1, videoId: 5 }
      ]);

      const result = await savedVideoService.listSavedVideos(1, mockSavedVideoModel);
      expect(result.savedVideos).toHaveLength(2);
    });

    it('deve lançar erro se userId não for informado', async () => {
      await expect(
        savedVideoService.listSavedVideos(null, mockSavedVideoModel)
      ).rejects.toThrow('Usuário não autenticado.');
    });
  });
});