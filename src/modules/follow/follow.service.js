export const toggleFollow = async (data, FollowModel) => {
  const { followerId, followingId } = data;

  if (!followerId) {
    throw new Error('Usuário não autenticado.');
  }

  if (!followingId) {
    throw new Error('Usuário alvo não informado.');
  }

  if (followerId === followingId) {
    throw new Error('Você não pode seguir a si mesmo.');
  }

  const existing = await FollowModel.findOne({ where: { followerId, followingId } });

  if (existing) {
    await FollowModel.destroy({ where: { followerId, followingId } });
    return { message: 'Você deixou de seguir.', following: false };
  }

  await FollowModel.create({ followerId, followingId });
  return { message: 'Agora você está seguindo!', following: true };
};

export const countFollowers = async (userId, FollowModel) => {
  if (!userId) {
    throw new Error('Usuário não informado.');
  }

  const total = await FollowModel.count({ where: { followingId: userId } });
  return { userId, total };
};

export const countFollowing = async (userId, FollowModel) => {
  if (!userId) {
    throw new Error('Usuário não informado.');
  }

  const total = await FollowModel.count({ where: { followerId: userId } });
  return { userId, total };
};