export const createVideo = async (data, VideoModel) => {
  const { title, description, videoUrl, coverUrl, userId, duration } = data;

  if (!title || title.trim() === '') {
    throw new Error('O título é obrigatório.');
  }

  if (!videoUrl || videoUrl.trim() === '') {
    throw new Error('O arquivo de vídeo é obrigatório.');
  }

  if (!userId) {
    throw new Error('Usuário não autenticado.');
  }

  const newVideo = await VideoModel.create({
    title: title.trim(),
    description: description || null,
    videoUrl,
    coverUrl: coverUrl || 'default-cover.png',
    userId,
    duration: duration || null
  });

  return {
    message: 'Vídeo criado com sucesso!',
    video: {
      id: newVideo.id,
      title: newVideo.title,
      videoUrl: newVideo.videoUrl,
      userId: newVideo.userId
    }
  };
};

export const deleteVideo = async (videoId, userId, VideoModel) => {
  const video = await VideoModel.findOne({ where: { id: videoId } });

  if (!video) {
    throw new Error('Vídeo não encontrado.');
  }

  if (video.userId !== userId) {
    throw new Error('Você não tem permissão para excluir este vídeo.');
  }

  await VideoModel.destroy({ where: { id: videoId } });

  return { message: 'Vídeo excluído com sucesso!' };
};

export const incrementViews = async (videoId, VideoModel) => {
  const video = await VideoModel.findOne({ where: { id: videoId } });

  if (!video) {
    throw new Error('Vídeo não encontrado.');
  }

  await VideoModel.update(
    { views: video.views + 1 },
    { where: { id: videoId } }
  );

  return { views: video.views + 1 };
};