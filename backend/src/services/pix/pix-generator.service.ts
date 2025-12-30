import { randomUUID } from 'crypto';
import { payload } from 'pix-payload';
import QRCode from 'qrcode';
import { CalculateTotalService } from '../cart-item/calculate-total.service.js';

interface GeneratePixParams {
  cartUuid: string;
  description?: string;
}

class PixGeneratorService {
  async execute({ cartUuid, description }: GeneratePixParams) {

    const calculateTotalService = new CalculateTotalService();
    const total = await calculateTotalService.execute(cartUuid);


    if (total <= 0) {
      throw new Error('Carrinho vazio ou sem itens válidos');
    }


    const transactionId = randomUUID().replace(/-/g, '').slice(0, 25);

    const amountInCents = Math.round(total * 100);

    if (amountInCents <= 0) {
      throw new Error('Valor do carrinho deve ser maior que zero');
    }

    const pixData = {
      key: 'faladelase@gmail.com',
      name: 'Luis Felipe Benites de M',
      city: 'Sao Paulo',
      amount: amountInCents,
      transactionId: transactionId,
    };

    let pixCopiaECola: string;
    try {
      pixCopiaECola = payload(pixData);
    } catch (error: any) {
      console.error('Erro ao gerar payload PIX:', error);
      throw new Error(`Erro ao gerar código PIX: ${error.message || 'Erro desconhecido'}`);
    }

    let qrCodeBase64: string;
    try {
      qrCodeBase64 = await QRCode.toDataURL(pixCopiaECola, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    } catch (error: any) {
      console.error('Erro ao gerar QR Code:', error);
      throw new Error(`Erro ao gerar QR Code: ${error.message || 'Erro desconhecido'}`);
    }

    return {
      transactionId,
      pixCopiaECola,
      qrCodeBase64,
      total,
      cartUuid,
      description,
    };
  }
}

export { PixGeneratorService };
