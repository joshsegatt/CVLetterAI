import { signIn, getSession } from 'next-auth/react';

// Test function to debug authentication
export async function testAuthentication() {
  console.log('🔧 Starting authentication debug...');
  
  try {
    console.log('1. Testing signIn function...');
    const result = await signIn('credentials', {
      emailOrUsername: 'test@example.com',
      password: '123456',
      redirect: false,
    });
    
    console.log('2. SignIn result:', result);
    
    if (result?.ok) {
      console.log('3. Getting session...');
      const session = await getSession();
      console.log('4. Session data:', session);
      
      if (session?.user) {
        console.log('✅ Authentication successful!');
        console.log('User:', session.user);
        return { success: true, session };
      } else {
        console.log('❌ No session found after login');
        return { success: false, error: 'No session' };
      }
    } else {
      console.log('❌ Login failed:', result?.error);
      return { success: false, error: result?.error };
    }
  } catch (error) {
    console.error('💥 Authentication test error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Helper to test current session
export async function testSession() {
  console.log('🔍 Checking current session...');
  const session = await getSession();
  console.log('Current session:', session);
  return session;
}