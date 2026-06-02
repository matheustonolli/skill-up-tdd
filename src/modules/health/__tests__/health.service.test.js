import { describe, it, expect } from 'vitest';
import * as healthService from '../health.service.js';

describe('Health Service', () => {
  describe('getHealth()', () => {
    it('deve retornar status OK', () => {
      const result = healthService.getHealth();
      expect(result.status).toBe('OK');
    });

    it('deve retornar a mensagem correta', () => {
      const result = healthService.getHealth();
      expect(result.message).toBe('Skill Up está saudável e pronto para TDD! 🚀');
    });

    it('deve retornar a versão 1.0.0', () => {
      const result = healthService.getHealth();
      expect(result.version).toBe('1.0.0');
    });

    it('deve retornar um timestamp válido', () => {
      const result = healthService.getHealth();
      expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
    });

    it('deve retornar todas as propriedades esperadas', () => {
      const result = healthService.getHealth();
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('version');
    });
  });
});