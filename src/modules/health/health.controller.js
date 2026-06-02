import * as healthService from './health.service.js';

export const check = (req, res) => {
  const result = healthService.getHealth();
  res.status(200).json(result);
};