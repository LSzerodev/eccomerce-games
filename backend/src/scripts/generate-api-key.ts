import crypto from 'crypto';

/**
 * Script para gerar uma API Key segura
 * Execute: npx tsx src/scripts/generate-api-key.ts
 */

const apiKey = crypto.randomBytes(32).toString('hex');

console.log('\n🔑 API Key gerada com sucesso!\n');
console.log('Adicione esta chave no seu .env do backend:');
console.log(`ADMIN_SECRET_KEY=${apiKey}\n`);
console.log('E no .env.local do frontend:');
console.log(`NEXT_PUBLIC_ADMIN_SECRET_KEY=${apiKey}\n`);
console.log('⚠️  IMPORTANTE: Mantenha esta chave segura e nunca a commite no repositório!\n');
