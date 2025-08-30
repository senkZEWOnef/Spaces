// Test upload as authenticated user
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAuthenticatedUpload() {
  console.log('🧪 Testing authenticated upload...');
  
  try {
    // Try to sign up or sign in a test user first
    console.log('🔐 Signing in test user...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'testuser@gmail.com',
      password: 'testpassword123'
    });
    
    if (authError) {
      console.log('No test user found, trying to create one...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'testuser@gmail.com',
        password: 'testpassword123'
      });
      
      if (signUpError) {
        console.error('❌ Could not create test user:', signUpError.message);
        return;
      } else {
        console.log('✅ Test user created');
      }
    } else {
      console.log('✅ Test user signed in');
    }
    
    // Now try uploading
    console.log('📤 Attempting authenticated upload...');
    // Create a tiny test image (1x1 pixel PNG)
    const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const testFile = new Blob([Uint8Array.from(atob(testImageData.split(',')[1]), c => c.charCodeAt(0))], { type: 'image/png' });
    
    const { data, error } = await supabase.storage
      .from('photos')
      .upload('test/auth-test.png', testFile, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      console.error('❌ Authenticated upload failed:', error.message);
    } else {
      console.log('✅ Authenticated upload successful!', data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuthenticatedUpload();