import * as savedVideoService from './savedVideo.service.js';
import SavedVideo from './savedVideo.model.js';

export const save = async (req, res) => {
  try {
    const result = await savedVideoService.saveVideo(
      { userId: req.session.user?.id, videoId: req.params.videoId },
      SavedVideo
    );
    req.flash('success', result.message);
    res.redirect(`/videos/${req.params.videoId}`);
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/videos/${req.params.videoId}`);
  }
};

export const unsave = async (req, res) => {
  try {
    const result = await savedVideoService.unsaveVideo(
      { userId: req.session.user?.id, videoId: req.params.videoId },
      SavedVideo
    );
    req.flash('success', result.message);
    res.redirect('back');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('back');
  }
};