export const createHashtag = async (data, HashtagModel) => {
  const { name, videoId } = data;

  if (!name || name.trim() === '') throw new Error('O nome da hashtag não pode estar vazio.');

  const cleanName = name.trim().toLowerCase().replace(/^#/, '');

  if (cleanName.length > 100) throw new Error('A hashtag deve ter no máximo 100 caracteres.');
  if (/\s/.test(cleanName)) throw new Error('A hashtag não pode conter espaços.');
  if (!videoId) throw new Error('Vídeo não informado.');

  const existing = await HashtagModel.findOne({ where: { name: cleanName } });
  if (existing) throw new Error('Essa hashtag já existe.');

  const newHashtag = await HashtagModel.create({ name: cleanName, videoId });

  return {
    message: 'Hashtag criada com sucesso!',
    hashtag: { id: newHashtag.id, name: newHashtag.name, videoId: newHashtag.videoId }
  };
};

export const deleteHashtag = async (hashtagId, HashtagModel) => {
  if (!hashtagId) throw new Error('Hashtag não informada.');

  const hashtag = await HashtagModel.findOne({ where: { id: hashtagId } });
  if (!hashtag) throw new Error('Hashtag não encontrada.');

  await HashtagModel.destroy({ where: { id: hashtagId } });

  return { message: 'Hashtag removida com sucesso!' };
};

export const listHashtagsByVideo = async (videoId, HashtagModel) => {
  if (!videoId) throw new Error('Vídeo não informado.');

  const hashtags = await HashtagModel.findAll({ where: { videoId } });
  return { hashtags };
};