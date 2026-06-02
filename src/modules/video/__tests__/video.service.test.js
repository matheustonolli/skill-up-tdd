import { describe, it, expect, beforeEach } from 'vitest';
import * as videoService from '../video.service.js';

describe('Video Service', () => {
  let mockVideoModel;

  beforeEach(() => {
    mockVideoModel = {
      findOne: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      destroy: vi.fn()
    };
  });

  describe('createVideo()', () => {
    it('deve criar vídeo com dados válidos', async () => {
      mockVideoModel.create.mockResolvedValueOnce({
        id: 1,
        title: 'Meu vídeo',
        videoUrl: 'uploads/videos/video.mp4',
        userId: 1
      });

      const result = await videoService.createVideo(
        {
          title: 'Meu vídeo',
          videoUrl: 'uploads/videos/video.mp4',
          userId: 1
        },
        mockVideoModel
      );

      expect(result.message).toBe('Vídeo criado com sucesso!');
      expect(result.video).toHaveProperty('id');
    });

    it('deve lançar erro se o título estiver vazio', async () => {
      await expect(
        videoService.createVideo(
          { title: '', videoUrl: 'uploads/videos/video.mp4', userId: 1 },
          mockVideoModel
        )
      ).rejects.toThrow('O título é obrigatório.');
    });
  });

  describe('deleteVideo()', () => {
    it('deve excluir vídeo quando o dono solicita', async () => {
      mockVideoModel.findOne.mockResolvedValueOnce({ id: 1, userId: 1 });
      mockVideoModel.destroy.mockResolvedValueOnce(1);

      const result = await videoService.deleteVideo(1, 1, mockVideoModel);
      expect(result.message).toBe('Vídeo excluído com sucesso!');
    });

    it('deve lançar erro se o vídeo não existir', async () => {
      mockVideoModel.findOne.mockResolvedValueOnce(null);

      await expect(
        videoService.deleteVideo(99, 1, mockVideoModel)
      ).rejects.toThrow('Vídeo não encontrado.');
    });
  });

  describe('incrementViews()', () => {
    it('deve incrementar as views do vídeo', async () => {
      mockVideoModel.findOne.mockResolvedValueOnce({ id: 1, views: 10 });
      mockVideoModel.update.mockResolvedValueOnce([1]);

      const result = await videoService.incrementViews(1, mockVideoModel);
      expect(result.views).toBe(11);
    });

    it('deve lançar erro se o vídeo não existir', async () => {
      mockVideoModel.findOne.mockResolvedValueOnce(null);

      await expect(
        videoService.incrementViews(99, mockVideoModel)
      ).rejects.toThrow('Vídeo não encontrado.');
    });
  });
});