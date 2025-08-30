// Test actual upload functionality
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testUpload() {
  console.log('🧪 Testing upload functionality...');
  
  // Create a tiny test image (1x1 pixel PNG)
  const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  const testFile = new Blob([Uint8Array.from(atob(testImageData.split(',')[1]), c => c.charCodeAt(0))], { type: 'image/png' });
  
  try {
    // Try to upload to photos bucket
    console.log('📤 Attempting upload...');
    const { data, error } = await supabase.storage
      .from('photos')
      .upload('test/test-image.png', testFile, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('❌ Upload failed:', error.message);
      
      if (error.message.includes('Bucket not found')) {
        console.log('💡 The photos bucket needs to be created in the Supabase Dashboard');
      } else if (error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        console.log('💡 Need to add storage policies for the photos bucket');
      }
    } else {
      console.log('✅ Upload successful!', data);
      
      // Try to get the public URL
      const { data: publicURL } = supabase.storage
        .from('photos')
        .getPublicUrl('test/test-image.png');
        
      console.log('🌐 Public URL:', publicURL);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testUpload();