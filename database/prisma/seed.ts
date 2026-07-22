import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const exists = await prisma.content.count();

  if (exists > 0) {
    return;
  }

  await prisma.content.create({
    data: {
      title: 'Arquitetura MVP para agentes de IA em saude',
      summary: 'Exemplo de stack com API NestJS, Next.js e servicos auxiliares.',
      body: 'Este artigo demonstra um MVP funcional com CRUD, documentacao e infraestrutura.',
      channel: 'medium',
      tags: ['mvp', 'ai', 'nestjs'],
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
