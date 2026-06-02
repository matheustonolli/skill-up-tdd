import { describe, it, expect, beforeEach } from 'vitest';
import * as commentService from '../comment.service.js';

describe('Comment Service', () => {
  let mockCommentModel;

  beforeEach(() => {
    mockCommentModel = {
      findOne: vi.fn(),
      create: vi.fn(),
      destroy: vi.fn()
    };
  });

  // ─── createComment ─────────────────────────────────────────

  describe('createComment()', () => {
    it('deve criar comentário com dados válidos', async () => {
      mockCommentModel.create.mockResolvedValueOnce({
        id: 1,
        content: 'Ótimo vídeo!',
        userId: 1,
        videoId: 1
      });

      const result = await commentService.createComment(
        { content: 'Ótimo vídeo!', userId: 1, videoId: 1 },
        mockCommentModel
      );

      expect(result.message).toBe('Comentário adicionado com sucesso!');
      expect(result.comment).toHaveProperty('id');
    });

    it('deve lançar erro se o conteúdo estiver vazio', async () => {
      await expect(
        commentService.createComment(
          { content: '', userId: 1, videoId: 1 },
          mockCommentModel
        )
      ).rejects.toThrow('O comentário não pode estar vazio.');
    });

    it('deve lançar erro se o comentário tiver mais de 500 caracteres', async () => {
      const conteudoLongo = 'a'.repeat(501);

      await expect(
        commentService.createComment(
          { content: conteudoLongo, userId: 1, videoId: 1 },
          mockCommentModel
        )
      ).rejects.toThrow('O comentário deve ter no máximo 500 caracteres.');
    });

    it('deve lançar erro se o userId não for informado', async () => {
      await expect(
        commentService.createComment(
          { content: 'Ótimo!', videoId: 1 },
          mockCommentModel
        )
      ).rejects.toThrow('Usuário não autenticado.');
    });

    it('deve lançar erro se o videoId não for informado', async () => {
      await expect(
        commentService.createComment(
          { content: 'Ótimo!', userId: 1 },
          mockCommentModel
        )
      ).rejects.toThrow('Vídeo não informado.');
    });
  });

  // ─── deleteComment ─────────────────────────────────────────

  describe('deleteComment()', () => {
    it('deve excluir comentário quando o dono solicita', async () => {
      mockCommentModel.findOne.mockResolvedValueOnce({ id: 1, userId: 1 });
      mockCommentModel.destroy.mockResolvedValueOnce(1);

      const result = await commentService.deleteComment(1, 1, mockCommentModel);
      expect(result.message).toBe('Comentário excluído com sucesso!');
    });

    it('deve lançar erro se o comentário não existir', async () => {
      mockCommentModel.findOne.mockResolvedValueOnce(null);

      await expect(
        commentService.deleteComment(99, 1, mockCommentModel)
      ).rejects.toThrow('Comentário não encontrado.');
    });

    it('deve lançar erro se outro usuário tentar excluir', async () => {
      mockCommentModel.findOne.mockResolvedValueOnce({ id: 1, userId: 2 });

      await expect(
        commentService.deleteComment(1, 1, mockCommentModel)
      ).rejects.toThrow('Você não tem permissão para excluir este comentário.');
    });
  });
});