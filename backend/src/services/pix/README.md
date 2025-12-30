# Serviço de Geração de QR Code PIX

Este serviço permite gerar QR Codes PIX estáticos com chave PIX predefinida e código "Copia e Cola". O serviço **calcula automaticamente o total do carrinho** usando o `cartUuid` fornecido.

## Bibliotecas Utilizadas

- **pix-payload**: Gera o payload PIX (código copia e cola) seguindo as especificações do Banco Central
- **qrcode**: Gera a imagem do QR Code a partir do payload PIX

## Como Usar

### Endpoint

```
POST /carts/:cartUuid/pix
```

### Parâmetros da URL

- **cartUuid** (obrigatório): UUID do carrinho de compras. O total será calculado automaticamente a partir dos itens do carrinho

### Request Body

```json
{
  "description": "Pagamento de pedido #123"
}
```

### Parâmetros do Body

- **description** (opcional): Descrição do pagamento

### Response

```json
{
  "transactionId": "uuid-da-transacao",
  "pixCopiaECola": "00020126580014br.gov.bcb.pix...",
  "qrCodeBase64": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "total": 150.75,
  "cartUuid": "uuid-do-carrinho",
  "description": "Pagamento de pedido #123"
}
```

### Exemplo de Uso com cURL

```bash
curl -X POST http://localhost:3333/carts/seu-uuid-do-carrinho/pix \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Pagamento de pedido"
  }'
```

### Exemplo de Uso no Frontend (JavaScript/TypeScript)

```typescript
const cartUuid = 'seu-uuid-do-carrinho';

const response = await fetch(`http://localhost:3333/carts/${cartUuid}/pix`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    description: 'Pagamento de pedido #123',
  }),
});

const data = await response.json();

const img = document.createElement('img');
img.src = data.qrCodeBase64;
document.body.appendChild(img);

console.log('Código PIX:', data.pixCopiaECola);
console.log('Total do carrinho:', data.total);
```

## Integração com Carrinho

O serviço utiliza automaticamente o `CalculateTotalService` para calcular o total do carrinho baseado nos itens adicionados. Não é necessário informar o valor manualmente - o sistema calcula automaticamente a partir dos produtos no carrinho.

## Tipos de Chave PIX Suportadas

- **CPF**: 12345678900
- **CNPJ**: 12345678000190
- **Email**: exemplo@email.com
- **Telefone**: +5511999999999
- **Chave Aleatória**: UUID gerado pelo Banco Central

## Notas Importantes

- O QR Code gerado é estático (valor fixo)
- Para PIX dinâmico (com expiração), é necessário integração com PSP (Provedor de Serviços de Pagamento)
- O código "Copia e Cola" pode ser usado diretamente em aplicativos bancários
- O QR Code é gerado em formato PNG base64, pronto para exibição em imagens HTML
