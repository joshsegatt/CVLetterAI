const { PrismaClient } = require('@prisma/client');

async function fixUserPlans() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verificando usuários no banco de dados...');
    
    // Buscar todos os usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        plan: true,
        createdAt: true
      }
    });
    
    console.log(`📊 Encontrados ${users.length} usuários`);
    
    // Mostrar usuários existentes
    users.forEach(user => {
      console.log(`- ${user.email}: ${user.plan} (criado em ${user.createdAt.toLocaleDateString()})`);
    });
    
    // Atualizar usuários com plano incorreto
    const usersToUpdate = users.filter(user => user.plan !== 'free');
    
    if (usersToUpdate.length > 0) {
      console.log(`\n🔧 Corrigindo ${usersToUpdate.length} usuários com plano incorreto...`);
      
      for (const user of usersToUpdate) {
        await prisma.user.update({
          where: { id: user.id },
          data: { plan: 'free' }
        });
        console.log(`✅ ${user.email}: ${user.plan} → free`);
      }
      
      console.log('\n✨ Correção concluída!');
    } else {
      console.log('\n✅ Todos os usuários já têm o plano correto (free)');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserPlans();