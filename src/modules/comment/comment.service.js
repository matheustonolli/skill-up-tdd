export const createComment = async (data, CommentModel) => {
  const { content, userId, videoId } = data;

  if (!content || content.trim() === '') {
    throw new Error('O comentário não pode estar vazio.');
  }

  if (content.trim().length > 500) {
    throw new Error('O comentário deve ter no máximo 500 caracteres.');
  }

  if (!userId) {
    throw new Error('Usuário não autenticado.');
  }

  if (!videoId) {
    throw new Error('Vídeo não informado.');
  }

  const newComment = await CommentModel.create({
    content: content.trim(),
    userId,
    videoId
  });

  return {
    message: 'Comentário adicionado com sucesso!',
    comment: {
      id: newComment.id,
      content: newComment.content,
      userId: newComment.userId,
      videoId: newComment.videoId
    }
  };
};

export const deleteComment = async (commentId, userId, CommentModel) => {
  const comment = await CommentModel.findOne({ where: { id: commentId } });

  if (!comment) {
    throw new Error('Comentário não encontrado.');
  }

  if (comment.userId !== userId) {
    throw new Error('Você não tem permissão para excluir este comentário.');
  }

  await CommentModel.destroy({ where: { id: commentId } });

  return { message: 'Comentário excluído com sucesso!' };
};