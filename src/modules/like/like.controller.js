import * as likeService from './like.service.js';
import Like from './like.model.js';

export const toggle = async (req, res) => {
  try {
    const data = {
      userId: req.session.user?.id,
      videoId: req.params.videoId
    };

    const result = await likeService.toggleLike(data, Like);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};