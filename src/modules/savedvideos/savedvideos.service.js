export const saveVideo = async (data, SavedVideoModel) => {
  const { userId, videoId } = data;

  if (!userId) throw new Error('Usuário não autenticado.');
  if (!videoId) throw new Error('Vídeo não informado.');

  const existing = await SavedVideoModel.findOne({ where: { userId, videoId } });
  if (existing) throw new Error('Vídeo já está salvo.');

  const saved = await SavedVideoModel.create({ userId, videoId });

  return {
    message: 'Vídeo salvo com sucesso!',
    savedVideo: { id: saved.id, userId: saved.userId, videoId: saved.videoId }
  };
};

export const unsaveVideo = async (data, SavedVideoModel) => {
  const { userId, videoId } = data;

  if (!userId) throw new Error('Usuário não autenticado.');
  if (!videoId) throw new Error('Vídeo não informado.');

  const saved = await SavedVideoModel.findOne({ where: { userId, videoId } });
  if (!saved) throw new Error('Vídeo não encontrado nos salvos.');

  await SavedVideoModel.destroy({ where: { userId, videoId } });

  return { message: 'Vídeo removido dos salvos com sucesso!' };
};

export const listSavedVideos = async (userId, SavedVideoModel) => {
  if (!userId) throw new Error('Usuário não autenticado.');

  const savedVideos = await SavedVideoModel.findAll({ where: { userId } });
  return { savedVideos };
};