import bcrypt from 'bcryptjs';

export const createUser = async (data, UserModel) => {
  const { name, email, password } = data;

  if (!name || name.trim() === '') throw new Error('O nome não pode estar vazio.');
  if (!email || email.trim() === '') throw new Error('O e-mail não pode estar vazio.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('E-mail inválido.');
  if (!password || password.length < 6) throw new Error('A senha deve ter no mínimo 6 caracteres.');

  const existing = await UserModel.findOne({ where: { email: email.trim().toLowerCase() } });
  if (existing) throw new Error('E-mail já cadastrado.');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserModel.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword
  });

  return {
    message: 'Usuário criado com sucesso!',
    user: { id: newUser.id, name: newUser.name, email: newUser.email }
  };
};

export const deleteUser = async (userId, UserModel) => {
  if (!userId) throw new Error('Usuário não informado.');

  const user = await UserModel.findOne({ where: { id: userId } });
  if (!user) throw new Error('Usuário não encontrado.');

  await UserModel.destroy({ where: { id: userId } });

  return { message: 'Usuário excluído com sucesso!' };
};