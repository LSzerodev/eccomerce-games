# 🛒 Plataforma de E-commerce

Uma plataforma de e-commerce moderna e simplificada, desenvolvida com foco em experiência do usuário e arquitetura escalável. Permite que usuários naveguem, visualizem produtos e realizem compras sem necessidade de cadastro ou login.

## 📋 Visão Geral

Esta plataforma resolve o problema de fricção na experiência de compra online, permitindo que usuários iniciem suas compras imediatamente, sem barreiras de cadastro. O sistema utiliza identificação por UUID para gerenciar carrinhos de compra de forma segura e eficiente.

### O que é a plataforma?

Uma solução completa de e-commerce que oferece:
- **Catálogo de produtos** com visualização em cards
- **Páginas de detalhes** para cada produto
- **Carrinho de compras** persistente sem necessidade de login
- **Arquitetura preparada** para evoluir com autenticação, pedidos e painel administrativo

### Qual problema resolve?

- **Redução de fricção**: Usuários podem comprar sem criar conta
- **Experiência fluida**: Navegação intuitiva do catálogo ao carrinho
- **Segurança**: Backend valida e calcula todos os valores sensíveis
- **Escalabilidade**: Estrutura preparada para crescimento futuro

## 🚀 Stack Tecnológica

### Backend
- **Node.js** - Runtime JavaScript server-side
- **Express** - Framework web minimalista e flexível
- **TypeScript** - Tipagem estática para maior segurança e produtividade
- **Prisma** - ORM moderno para gerenciamento de banco de dados
- **PostgreSQL** - Banco de dados relacional robusto e confiável

### Frontend
- **Next.js** – Framework React utilizado para construir a interface do ecommerce, oferecendo melhor performance, renderização híbrida (SSR/SSG) e otimização para SEO.
- **TypeScript** - Tipagem estática no frontend

## 🗄️ Modelagem de Dados

### Entidades Principais

#### Product (Produto)
Representa os produtos disponíveis na plataforma.

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Decimal
  imageUrl    String?
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  cartItems   CartItem[]
}
```

**Campos principais:**
- `name`: Nome do produto
- `description`: Descrição detalhada (opcional)
- `price`: Preço unitário (calculado no backend)
- `imageUrl`: URL da imagem do produto
- `stock`: Quantidade disponível em estoque

#### Cart (Carrinho)
Representa um carrinho de compras identificado por UUID.

```prisma
model Cart {
  id        String     @id @default(uuid())
  uuid      String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  items     CartItem[]
}
```

**Características:**
- `uuid`: Identificador único gerado no backend e armazenado no cliente
- Cada carrinho é independente e não requer autenticação

#### CartItem (Item do Carrinho)
Representa um produto adicionado ao carrinho.

```prisma
model CartItem {
  id        String   @id @default(uuid())
  cartId    String
  productId String
  quantity  Int      @default(1)
  createdAt DateTime @default(now())

  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id])

  @@unique([cartId, productId])
}
```

**Funcionalidades:**
- Relacionamento muitos-para-muitos entre Cart e Product
- `quantity`: Quantidade do produto no carrinho
- Prevenção de duplicatas (mesmo produto no mesmo carrinho)

## 🛒 Como Funciona o Carrinho sem Login

### Uso de UUID

O sistema utiliza **UUID (Universally Unique Identifier)** para identificar carrinhos de forma única e segura:

1. **Geração**: O UUID é gerado no backend quando o usuário acessa a plataforma pela primeira vez
2. **Armazenamento**: O UUID é salvo no cliente (localStorage ou cookie)
3. **Identificação**: Todas as requisições relacionadas ao carrinho incluem o UUID

### Onde é Armazenado

O UUID pode ser armazenado de duas formas:

- **localStorage** (recomendado para SPAs):
  - Persiste entre sessões do navegador
  - Acessível apenas via JavaScript no mesmo domínio
  - Não é enviado automaticamente nas requisições HTTP

- **Cookie** (alternativa):
  - Enviado automaticamente nas requisições
  - Pode ser configurado com HttpOnly para maior segurança
  - Funciona bem com SSR (Server-Side Rendering)

### Por que essa Abordagem?

✅ **Vantagens:**
- **Zero fricção**: Usuário não precisa criar conta
- **Experiência imediata**: Compra pode começar em segundos
- **Persistência**: Carrinho mantido entre sessões
- **Segurança**: UUID é gerado no backend, não manipulável pelo cliente
- **Escalabilidade**: Fácil migração para sistema com login no futuro

⚠️ **Considerações:**
- Carrinho vinculado ao dispositivo/navegador
- Migração futura para conta de usuário requer estratégia de merge

## 🔄 Fluxo do Usuário

### 1. Entrar na Home
```
Usuário acessa a plataforma
  ↓
Backend gera UUID (se não existir)
  ↓
Frontend armazena UUID
  ↓
Lista de produtos é carregada
```

### 2. Visualizar Produtos
```
GET /api/products
  ↓
Frontend exibe cards de produtos
  ↓
Cada card mostra: imagem, nome, preço, botão "Comprar"
```

### 3. Ver Detalhes do Produto
```
Usuário clica em "Comprar" ou no card
  ↓
Navega para /products/:id
  ↓
GET /api/products/:id
  ↓
Exibe detalhes completos do produto
```

### 4. Adicionar ao Carrinho
```
Usuário seleciona quantidade e clica "Adicionar ao Carrinho"
  ↓
POST /api/cart/items
  Body: { productId, quantity, cartUuid }
  ↓
Backend valida:
  - Produto existe
  - Estoque disponível
  - Preço calculado no backend
  ↓
Item adicionado ao carrinho
  ↓
Frontend atualiza estado do carrinho
```

## 🛡️ Boas Práticas Adotadas

### Segurança e Validação

#### Backend Calcula Preços
- ✅ Frontend **nunca** envia valores de preço
- ✅ Backend sempre busca preço atual do banco de dados
- ✅ Previne manipulação de valores pelo cliente
- ✅ Garante consistência mesmo com alterações de preço

**Exemplo:**
```typescript
// ❌ ERRADO - Frontend envia preço
POST /api/cart/items
{ productId: "123", quantity: 2, price: 99.90 }

// ✅ CORRETO - Backend calcula preço
POST /api/cart/items
{ productId: "123", quantity: 2, cartUuid: "uuid-here" }
// Backend busca preço do produto no banco
```

#### Validação de Estoque
- Backend verifica disponibilidade antes de adicionar ao carrinho
- Previne overselling (vender mais que o estoque disponível)
- Retorna erros claros quando estoque insuficiente

#### Validação de Dados
- Todos os inputs são validados no backend
- TypeScript garante tipagem em tempo de desenvolvimento
- Prisma valida estrutura de dados no banco

### Arquitetura Preparada para Evolução

#### Estrutura Modular
```
backend/
  src/
    routes/       # Rotas organizadas por domínio
    controllers/  # Lógica de negócio
    services/     # Serviços reutilizáveis
    models/       # Modelos Prisma
    middleware/   # Middlewares (auth, validation, etc)
```

#### Preparação para Login
- Estrutura de rotas permite adicionar autenticação sem refatoração
- Modelos podem ser estendidos com relacionamento User
- Middleware de autenticação pode ser adicionado seletivamente

#### Preparação para Pedidos
- Modelo Cart pode evoluir para Order
- Histórico de compras pode ser implementado
- Sistema de pagamento pode ser integrado

#### Preparação para Admin
- Rotas administrativas podem ser adicionadas
- Middleware de autorização para roles
- Painel de gerenciamento de produtos

## 📁 Estrutura do Projeto

```
plataform-games/
├── backend/
│   ├── src/
│   │   ├── routes/        # Definição de rotas
│   │   ├── controllers/   # Lógica de negócio
│   │   ├── services/      # Serviços reutilizáveis
│   │   ├── middleware/    # Middlewares
│   │   └── server.ts      # Configuração do servidor
│   ├── prisma/
│   │   ├── schema.prisma  # Schema do banco de dados
│   │   └── migrations/    # Histórico de migrations
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/    # Componentes React
    │   ├── pages/         # Páginas da aplicação
    │   ├── hooks/         # Custom hooks
    │   ├── services/      # Serviços de API
    │   └── App.tsx
    └── package.json
```

## 🔮 Próximos Passos (Roadmap)

- [ ] Sistema de autenticação de usuários
- [ ] Finalização de pedidos (checkout)
- [ ] Histórico de compras
- [ ] Painel administrativo
- [ ] Sistema de avaliações de produtos
- [ ] Busca e filtros avançados
- [ ] Integração com gateway de pagamento

## 📝 Licença

ISC

---

Desenvolvido com ❤️ usando Node.js, React, PostgreSQL e Prisma
