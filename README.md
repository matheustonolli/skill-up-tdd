# RELATORIO.md — Skill Up TDD

## 1. Funcionalidade Escolhida e Regras de Negócio

A funcionalidade principal implementada com TDD foi o **cadastro e exclusão de usuários**, localizada em `src/modules/user/user.service.js`.

O projeto **Skill Up** é uma plataforma de compartilhamento de vídeos educacionais, com funcionalidades de usuários, vídeos, comentários, likes, follows, hashtags e vídeos salvos.

### Regras de negócio do `createUser`:

- **Nome obrigatório**: o campo `name` não pode estar vazio ou conter apenas espaços. Erro: `"O nome não pode estar vazio."`
- **E-mail obrigatório**: o campo `email` não pode estar vazio. Erro: `"O e-mail não pode estar vazio."`
- **E-mail válido**: o e-mail deve seguir o formato padrão (`user@domain.com`). Erro: `"E-mail inválido."`
- **Senha mínima**: a senha deve ter no mínimo 6 caracteres. Erro: `"A senha deve ter no mínimo 6 caracteres."`
- **E-mail único**: não pode existir outro usuário com o mesmo e-mail. Erro: `"E-mail já cadastrado."`
- **Hash de senha**: antes de salvar, a senha é criptografada com `bcryptjs`.
- **Retorno seguro**: o objeto retornado contém apenas `id`, `name` e `email` — nunca a senha.

### Regras de negócio do `deleteUser`:

- **ID obrigatório**: o `userId` deve ser informado. Erro: `"Usuário não informado."`
- **Usuário deve existir**: o usuário precisa estar cadastrado. Erro: `"Usuário não encontrado."`

---

## 2. Como o TDD foi Aplicado — Ciclo Red-Green-Refactor

O desenvolvimento seguiu estritamente o ciclo **Red → Green → Refactor**:

### 🔴 Red — Escrever o teste antes do código

O primeiro passo foi escrever um teste para uma funcionalidade que ainda não existia. Por exemplo, antes de implementar qualquer validação em `createUser`, o seguinte teste foi escrito:

```js
it('deve lançar erro se o nome estiver vazio', async () => {
  await expect(
    userService.createUser({ name: '', email: 'joao@email.com', password: '123456' }, mockUserModel)
  ).rejects.toThrow('O nome não pode estar vazio.');
});
```

Ao rodar `npm test`, o teste falhou — confirmando a fase Red, pois a função ainda não tinha essa validação.

### 🟢 Green — Implementar o mínimo para passar

Com o teste falhando, foi implementada a validação mínima necessária:

```js
export const createUser = async (data, UserModel) => {
  const { name, email, password } = data;

  if (!name || name.trim() === '') throw new Error('O nome não pode estar vazio.');
  // ...
};
```

O teste passou. O ciclo Green foi concluído.

### 🔵 Refactor — Melhorar sem quebrar

Após cada conjunto de testes passar, o código foi revisado para manter a legibilidade: as validações foram ordenadas de forma lógica (nome → e-mail → formato → senha → duplicidade), e o retorno foi padronizado para nunca expor a senha. Os testes continuaram passando após cada ajuste.

Esse ciclo se repetiu para cada regra de negócio: e-mail inválido, e-mail duplicado, hash de senha, retorno sem password, e para o `deleteUser` com usuário inexistente.

---

## 3. Exemplos de Testes Unitários

Os testes estão em `src/modules/user/__tests__/user.service.test.js`. Abaixo estão 3 exemplos com explicação detalhada.

---

### Teste 1 — Criação bem-sucedida de usuário

```js
it('deve criar usuário com dados válidos', async () => {
  mockUserModel.findOne.mockResolvedValueOnce(null);
  mockUserModel.create.mockResolvedValueOnce({ id: 1, name: 'João', email: 'joao@email.com' });

  const result = await userService.createUser(
    { name: 'João', email: 'joao@email.com', password: '123456' },
    mockUserModel
  );

  expect(result.message).toBe('Usuário criado com sucesso!');
  expect(result.user).toHaveProperty('id');
});
```

**O que verifica**: que, ao fornecer dados válidos, o service retorna a mensagem de sucesso e o objeto do usuário com a propriedade `id`. O `mockUserModel.findOne` retorna `null` (simulando que o e-mail ainda não existe), e o `mockUserModel.create` retorna um objeto fictício. O banco de dados real não é acessado — todo o isolamento é feito via `vi.fn()`.

---

### Teste 2 — Rejeição de e-mail inválido

```js
it('deve lançar erro se o e-mail for inválido', async () => {
  await expect(
    userService.createUser({ name: 'João', email: 'invalido', password: '123456' }, mockUserModel)
  ).rejects.toThrow('E-mail inválido.');
});
```

**O que verifica**: que a validação de formato de e-mail está funcionando. Quando o campo `email` não segue o padrão `user@domínio.com` (testado via regex no service), a função rejeita a promessa com o erro correto. O mock nem chega a ser chamado, pois a validação acontece antes de qualquer consulta ao banco.

---

### Teste 3 — Proteção contra exposição da senha

```js
it('não deve retornar a senha no resultado', async () => {
  mockUserModel.findOne.mockResolvedValueOnce(null);
  mockUserModel.create.mockResolvedValueOnce({ id: 1, name: 'João', email: 'joao@email.com' });

  const result = await userService.createUser(
    { name: 'João', email: 'joao@email.com', password: '123456' },
    mockUserModel
  );

  expect(result.user).not.toHaveProperty('password');
});
```

**O que verifica**: que o objeto retornado pelo service nunca expõe o campo `password`, mesmo após o cadastro bem-sucedido. Essa é uma regra de segurança crítica: o hash da senha é salvo no banco, mas não deve ser transmitido de volta ao cliente. O teste usa `.not.toHaveProperty('password')` para garantir essa proteção.

---

*Relatório elaborado como parte da Avaliação N2 — Testes de Software. Projeto: Skill Up TDD.*