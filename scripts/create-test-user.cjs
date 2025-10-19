const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔐 Creating test user...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('123456', 12);
    
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        password: hashedPassword,
        emailVerified: new Date(),
        plan: 'free',
        tokensUsed: 0,
        messagesUsed: 0,
        isEmailVerified: true,
      }
    });
    
    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@example.com');
    console.log('👤 Username: testuser');
    console.log('🔑 Password: 123456');
    console.log('🆔 User ID:', user.id);
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️ User already exists!');
      console.log('📧 Email: test@example.com');
      console.log('👤 Username: testuser');
      console.log('🔑 Password: 123456');
    } else {
      console.error('❌ Error creating user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();