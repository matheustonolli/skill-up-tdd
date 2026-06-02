import * as hashtagService from './hashtag.service.js';
import Hashtag from './hashtag.model.js';

export const create = async (req, res) => {
  try {
    const result = await hashtagService.createHashtag(
      { name: req.body.name, videoId: req.params.videoId },
      Hashtag
    );
    req.flash('success', result.message);
    res.redirect(`/videos/${req.params.videoId}`);
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/videos/${req.params.videoId}`);
  }
};

export const remove = async (req, res) => {
  try {
    const result = await hashtagService.deleteHashtag(req.params.id, Hashtag);
    req.flash('success', result.message);
    res.redirect('back');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('back');
  }
};