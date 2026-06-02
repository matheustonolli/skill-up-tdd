import * as userService from './user.service.js';
import User from './user.model.js';

export const create = async (req, res) => {
  try {
    const result = await userService.createUser(req.body, User);
    req.flash('success', result.message);
    res.redirect('/login');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/register');
  }
};

export const remove = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id, User);
    req.flash('success', result.message);
    res.redirect('/users');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/users');
  }
};