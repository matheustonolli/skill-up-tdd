import * as commentService from './comment.service.js';
import Comment from './comment.model.js';

export const create = async (req, res) => {
  try {
    const data = {
      content: req.body.content,
      userId: req.session.user?.id,
      videoId: req.params.videoId
    };

    const result = await commentService.createComment(data, Comment);
    req.flash('success', result.message);
    res.redirect(`/videos/${req.params.videoId}`);
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/videos/${req.params.videoId}`);
  }
};

export const remove = async (req, res) => {
  try {
    const result = await commentService.deleteComment(
      req.params.id,
      req.session.user?.id,
      Comment
    );
    req.flash('success', result.message);
    res.redirect('back');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('back');
  }
};