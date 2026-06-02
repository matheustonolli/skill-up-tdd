import * as videoService from './video.service.js';
import Video from './video.model.js';

export const create = async (req, res) => {
  try {
    const data = {
      ...req.body,
      userId: req.session.user?.id,
      videoUrl: req.files?.video?.[0]?.filename,
      coverUrl: req.files?.cover?.[0]?.filename
    };

    const result = await videoService.createVideo(data, Video);
    req.flash('success', result.message);
    res.redirect('/feed');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/videos/new');
  }
};

export const remove = async (req, res) => {
  try {
    const result = await videoService.deleteVideo(
      req.params.id,
      req.session.user?.id,
      Video
    );
    req.flash('success', result.message);
    res.redirect('/feed');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/feed');
  }
};