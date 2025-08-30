// Test upload with service role key
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function testServiceUpload() {
  console.log('🧪 Testing upload with service role key...');
  
  // Create a tiny test file
  const testContent = 'test file content for service role';
  const testFile = new Blob([testContent], { type: 'text/plain' });
  
  try {
    // Try to upload to photos bucket
    console.log('📤 Attempting service role upload...');
    const { data, error } = await supabase.storage
      .from('photos')
      .upload('test/service-test.txt', testFile, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      console.error('❌ Service upload failed:', error.message);
    } else {
      console.log('✅ Service upload successful!', data);
      
      // Try to get the public URL
      const { data: publicURL } = supabase.storage
        .from('photos')
        .getPublicUrl('test/service-test.txt');
        
      console.log('🌐 Public URL:', publicURL);
    }
    
  } catch (error) {
    console.error('❌ Service test failed:', error);
  }
}

testServiceUpload();