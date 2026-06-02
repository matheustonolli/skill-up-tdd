import * as followService from './follow.service.js';
import Follow from './follow.model.js';

export const toggle = async (req, res) => {
  try {
    const data = {
      followerId: req.session.user?.id,
      followingId: parseInt(req.params.userId)
    };

    const result = await followService.toggleFollow(data, Follow);
    req.flash('success', result.message);
    res.redirect(`/profile/${req.params.userId}`);
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/profile/${req.params.userId}`);
  }
};