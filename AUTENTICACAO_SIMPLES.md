# 🔐 Autenticação Admin Simples - API Key

Sistema de autenticação simples usando API Key para proteger as rotas administrativas.

## 🎯 Por que API Key?

Para projetos simples onde:
- ✅ Apenas você acessa o painel admin
- ✅ Não precisa de múltiplos usuários
- ✅ Não precisa de login/logout
- ✅ Quer algo simples e direto

## ⚙️ Configuração

### 1. Backend - Variável de Ambiente

Crie ou edite o arquivo `.env` na pasta `backend/`:

```env
ADMIN_SECRET_KEY=sua_chave_secreta_super_forte_aqui
```

**Gerar uma chave forte:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Ou use qualquer string longa e aleatória que você preferir.

### 2. Frontend - Configurar API Key

Você tem duas opções:

#### Opção 1: Variável de Ambiente (Recomendado para produção)

Crie um arquivo `.env.local` na pasta `front-end/project-games/`:

```env
NEXT_PUBLIC_ADMIN_SECRET_KEY=sua_chave_secreta_super_forte_aqui
```

#### Opção 2: localStorage (Para desenvolvimento)

No console do navegador, quando estiver na página admin:

```javascript
localStorage.setItem('admin_api_key', 'sua_chave_secreta_super_forte_aqui');
```

## 🔒 Rotas Protegidas

As seguintes rotas requerem a API Key:

- `POST /products` - Criar produto
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Deletar produto
- `POST /products/:productId/options` - Adicionar opções
- `POST /productOptions` - Criar opção de produto
- `DELETE /productOptions/:productOptionId` - Deletar opção

## 🌐 Rotas Públicas

- `GET /products` - Listar produtos
- `GET /products/:id` - Obter produto
- Todas as rotas de carrinho (`/carts/*`)

## 📡 Como Funciona

### Backend

O middleware `adminAuth` verifica:
1. Se o header `x-api-key` está presente
2. Se a chave corresponde à `ADMIN_SECRET_KEY` do `.env`
3. Retorna 401/403 se inválida

### Frontend

O interceptor do axios:
1. Verifica se há API Key no `localStorage` ou `.env`
2. Adiciona automaticamente no header `x-api-key`
3. Apenas para rotas admin (POST, PUT, DELETE)

## 🚀 Uso

### Testar no Postman/Insomnia

Adicione o header:
```
x-api-key: sua_chave_secreta_super_forte_aqui
```

### Testar no Frontend

1. Configure a API Key (variável de ambiente ou localStorage)
2. Acesse `/admin/*`
3. As requisições admin funcionarão automaticamente

## 🔐 Segurança

### ✅ Implementado

- Validação de API Key no backend
- Interceptor automático no frontend
- Erros claros quando a chave está faltando/inválida

### ⚠️ Recomendações

1. **Nunca commite a API Key** no repositório
2. Use variáveis de ambiente em produção
3. Gere uma chave forte e única
4. Considere usar HTTPS em produção
5. Se precisar de mais segurança, adicione rate limiting

## 🆚 Comparação com Login Completo

| Aspecto | API Key | Login Completo |
|---------|---------|----------------|
| Complexidade | ⭐ Simples | ⭐⭐⭐ Complexo |
| Setup | 2 minutos | 30+ minutos |
| Manutenção | Baixa | Média |
| Múltiplos usuários | ❌ | ✅ |
| Recuperação de senha | N/A | ✅ |
| Ideal para | Projeto simples, 1 admin | Múltiplos admins |

## 🐛 Troubleshooting

### Erro: "API Key não fornecida"

Verifique se:
- A API Key está configurada no frontend
- O header `x-api-key` está sendo enviado
- Você está fazendo requisição para uma rota protegida

### Erro: "API Key inválida"

Verifique se:
- A chave no `.env` do backend corresponde à do frontend
- Não há espaços extras na chave
- A chave não foi alterada acidentalmente

### Erro: "ADMIN_SECRET_KEY não configurado"

Adicione `ADMIN_SECRET_KEY` no arquivo `.env` do backend.

## 📝 Notas

- A API Key é enviada em todas as requisições admin automaticamente
- Você pode mudar a chave a qualquer momento (apenas atualize em ambos os lugares)
- Para mais segurança, considere rotacionar a chave periodicamente
