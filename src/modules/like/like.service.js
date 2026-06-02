export const toggleLike = async (data, LikeModel) => {
  const { userId, videoId } = data;

  if (!userId) {
    throw new Error('Usuário não autenticado.');
  }

  if (!videoId) {
    throw new Error('Vídeo não informado.');
  }

  const existing = await LikeModel.findOne({ where: { userId, videoId } });

  if (existing) {
    await LikeModel.destroy({ where: { userId, videoId } });
    return { message: 'Like removido.', liked: false };
  }

  await LikeModel.create({ userId, videoId });
  return { message: 'Like adicionado!', liked: true };
};

export const countLikes = async (videoId, LikeModel) => {
  if (!videoId) {
    throw new Error('Vídeo não informado.');
  }

  const total = await LikeModel.count({ where: { videoId } });
  return { videoId, total };
};