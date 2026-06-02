import { describe, it, expect, beforeEach } from 'vitest';
import * as followService from '../follow.service.js';

describe('Follow Service', () => {
  let mockFollowModel;

  beforeEach(() => {
    mockFollowModel = {
      findOne: vi.fn(),
      create: vi.fn(),
      destroy: vi.fn(),
      count: vi.fn()
    };
  });

  // ─── toggleFollow ──────────────────────────────────────────

  describe('toggleFollow()', () => {
    it('deve seguir um usuário quando ainda não segue', async () => {
      mockFollowModel.findOne.mockResolvedValueOnce(null);
      mockFollowModel.create.mockResolvedValueOnce({ id: 1, followerId: 1, followingId: 2 });

      const result = await followService.toggleFollow(
        { followerId: 1, followingId: 2 },
        mockFollowModel
      );

      expect(result.following).toBe(true);
      expect(result.message).toBe('Agora você está seguindo!');
    });

    it('deve deixar de seguir quando já segue', async () => {
      mockFollowModel.findOne.mockResolvedValueOnce({ id: 1, followerId: 1, followingId: 2 });
      mockFollowModel.destroy.mockResolvedValueOnce(1);

      const result = await followService.toggleFollow(
        { followerId: 1, followingId: 2 },
        mockFollowModel
      );

      expect(result.following).toBe(false);
      expect(result.message).toBe('Você deixou de seguir.');
    });

    it('deve lançar erro se tentar seguir a si mesmo', async () => {
      await expect(
        followService.toggleFollow({ followerId: 1, followingId: 1 }, mockFollowModel)
      ).rejects.toThrow('Você não pode seguir a si mesmo.');
    });

    it('deve lançar erro se followerId não for informado', async () => {
      await expect(
        followService.toggleFollow({ followingId: 2 }, mockFollowModel)
      ).rejects.toThrow('Usuário não autenticado.');
    });

    it('deve lançar erro se followingId não for informado', async () => {
      await expect(
        followService.toggleFollow({ followerId: 1 }, mockFollowModel)
      ).rejects.toThrow('Usuário alvo não informado.');
    });
  });

  // ─── countFollowers ────────────────────────────────────────

  describe('countFollowers()', () => {
    it('deve retornar a contagem de seguidores de um usuário', async () => {
      mockFollowModel.count.mockResolvedValueOnce(150);

      const result = await followService.countFollowers(2, mockFollowModel);

      expect(result.total).toBe(150);
      expect(result.userId).toBe(2);
    });

    it('deve lançar erro se userId não for informado', async () => {
      await expect(
        followService.countFollowers(null, mockFollowModel)
      ).rejects.toThrow('Usuário não informado.');
    });
  });

  // ─── countFollowing ────────────────────────────────────────

  describe('countFollowing()', () => {
    it('deve retornar quantos usuários alguém está seguindo', async () => {
      mockFollowModel.count.mockResolvedValueOnce(30);

      const result = await followService.countFollowing(1, mockFollowModel);

      expect(result.total).toBe(30);
      expect(result.userId).toBe(1);
    });

    it('deve lançar erro se userId não for informado', async () => {
      await expect(
        followService.countFollowing(null, mockFollowModel)
      ).rejects.toThrow('Usuário não informado.');
    });
  });
});