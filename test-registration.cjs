const fetch = require('node-fetch');

async function testRegistration() {
  try {
    console.log('🚀 Testando API de registro...');
    
    const testUser = {
      firstName: 'João',
      lastName: 'Silva',
      username: `teste${Date.now()}`,
      email: `teste${Date.now()}@email.com`,
      password: 'senha123456',
      confirmPassword: 'senha123456',
      agreeToTerms: true
    };
    
    console.log('📤 Enviando dados:', {
      ...testUser,
      password: '[HIDDEN]',
      confirmPassword: '[HIDDEN]'
    });
    
    const response = await fetch('http://localhost:3000/api/test-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    const result = await response.json();
    
    console.log('📥 Status:', response.status);
    console.log('📥 Resposta:', JSON.stringify(result, null, 2));
    
    if (result.test === 'SUCCESS') {
      console.log('✅ SUCESSO: Registro funcionou perfeitamente!');
      console.log('👤 Usuário criado:', result.user.email);
    } else {
      console.log('❌ FALHA:', result.error);
      console.log('📍 Etapa que falhou:', result.step);
    }
    
  } catch (error) {
    console.error('💥 Erro ao testar:', error.message);
  }
}

testRegistration();