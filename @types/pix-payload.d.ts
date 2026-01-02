declare module 'pix-payload' {
  interface PixPayloadData {
    key: string;
    name: string;
    city: string;
    amount: number;
    transactionId: string;
  }

  export function payload(data: PixPayloadData): string;
}
