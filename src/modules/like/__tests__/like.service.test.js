import { describe, it, expect, beforeEach } from 'vitest';
import * as likeService from '../like.service.js';

describe('Like Service', () => {
  let mockLikeModel;

  beforeEach(() => {
    mockLikeModel = {
      findOne: vi.fn(),
      create: vi.fn(),
      destroy: vi.fn(),
      count: vi.fn()
    };
  });

  // ─── toggleLike ────────────────────────────────────────────

  describe('toggleLike()', () => {
    it('deve adicionar like quando ainda não existe', async () => {
      mockLikeModel.findOne.mockResolvedValueOnce(null);
      mockLikeModel.create.mockResolvedValueOnce({ id: 1, userId: 1, videoId: 1 });

      const result = await likeService.toggleLike(
        { userId: 1, videoId: 1 },
        mockLikeModel
      );

      expect(result.liked).toBe(true);
      expect(result.message).toBe('Like adicionado!');
    });

    it('deve remover like quando já existe', async () => {
      mockLikeModel.findOne.mockResolvedValueOnce({ id: 1, userId: 1, videoId: 1 });
      mockLikeModel.destroy.mockResolvedValueOnce(1);

      const result = await likeService.toggleLike(
        { userId: 1, videoId: 1 },
        mockLikeModel
      );

      expect(result.liked).toBe(false);
      expect(result.message).toBe('Like removido.');
    });

    it('deve lançar erro se userId não for informado', async () => {
      await expect(
        likeService.toggleLike({ videoId: 1 }, mockLikeModel)
      ).rejects.toThrow('Usuário não autenticado.');
    });
  });

  describe('countLikes()', () => {
    it('deve retornar a contagem de likes de um vídeo', async () => {
      mockLikeModel.count.mockResolvedValueOnce(42);

      const result = await likeService.countLikes(1, mockLikeModel);

      expect(result.total).toBe(42);
      expect(result.videoId).toBe(1);
    });

    it('deve lançar erro se videoId não for informado', async () => {
      await expect(
        likeService.countLikes(null, mockLikeModel)
      ).rejects.toThrow('Vídeo não informado.');
    });
  });
});