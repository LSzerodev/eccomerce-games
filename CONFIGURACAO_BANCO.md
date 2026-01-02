# 🔧 Configuração do Banco de Dados PostgreSQL

## Passo a Passo para Conectar ao PostgreSQL

### 1. Configure o arquivo `.env`

Crie ou edite o arquivo `.env` na pasta `backend/` com a seguinte estrutura:

```env
# Database
# Formato: postgresql://usuario:senha@host:porta/nome_do_banco?schema=public
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"

# Server
PORT=3333
NODE_ENV=development

# CORS (opcional)
FRONTEND_URL=http://localhost:3000
```

### 2. Exemplo de DATABASE_URL

**PostgreSQL Local:**
```env
DATABASE_URL="postgresql://postgres:minhasenha@localhost:5432/plataform_games?schema=public"
```

**PostgreSQL Remoto (ex: Railway, Supabase, etc):**
```env
DATABASE_URL="postgresql://usuario:senha@host.railway.app:5432/railway?schema=public"
```

### 3. Gerar o Cliente Prisma

Após configurar o `.env`, gere o cliente Prisma:

```bash
npm run prisma:generate
```

Ou:

```bash
npx prisma generate
```

### 4. Criar as Tabelas no Banco

Execute as migrations para criar as tabelas:

```bash
npm run prisma:migrate
```

Ou:

```bash
npx prisma migrate dev
```

Na primeira execução, você será solicitado a dar um nome à migration (ex: `init`).

### 5. Verificar a Conexão

Abra o Prisma Studio para visualizar o banco:

```bash
npm run prisma:studio
```

Ou:

```bash
npx prisma studio
```

Isso abrirá uma interface web em `http://localhost:5555` onde você pode ver e editar os dados.

## 🔍 Solução de Problemas

### Erro: "Can't reach database server"

- Verifique se o PostgreSQL está rodando
- Confirme se o host, porta, usuário e senha estão corretos no `.env`
- Teste a conexão manualmente com `psql` ou um cliente PostgreSQL

### Erro: "Database does not exist"

- Crie o banco de dados manualmente:
  ```sql
  CREATE DATABASE nome_do_banco;
  ```
- Ou ajuste o `DATABASE_URL` para apontar para um banco existente

### Erro: "Authentication failed"

- Verifique usuário e senha no `.env`
- Confirme as permissões do usuário no PostgreSQL

## 📝 Próximos Passos

Após conectar o banco:

1. ✅ Cliente Prisma gerado
2. ✅ Tabelas criadas
3. ✅ Prisma Studio funcionando
4. 🚀 Pronto para usar `prisma` no código!

Exemplo de uso no código:

```typescript
import prisma from './lib/prisma.js';

// Buscar produtos
const products = await prisma.product.findMany();

// Criar carrinho
const cart = await prisma.cart.create({
  data: {
    uuid: 'uuid-gerado-aqui'
  }
});
```

