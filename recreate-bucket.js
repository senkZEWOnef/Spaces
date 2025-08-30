// Recreate bucket with proper settings
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function recreateBucket() {
  console.log('🗑️  Recreating photos bucket...');
  
  try {
    // First delete the existing bucket
    console.log('Deleting existing bucket...');
    const { error: deleteError } = await serviceSupabase.storage.deleteBucket('photos');
    
    if (deleteError && !deleteError.message.includes('not found')) {
      console.log('⚠️  Delete error (might not exist):', deleteError.message);
    } else {
      console.log('✅ Old bucket deleted');
    }
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create new bucket with proper settings
    console.log('Creating new bucket...');
    const { data: newBucket, error: createError } = await serviceSupabase.storage.createBucket('photos', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 10 * 1024 * 1024 // 10MB
    });
    
    if (createError) {
      console.error('❌ Create error:', createError);
    } else {
      console.log('✅ New bucket created:', newBucket);
      
      // Test with anon key
      console.log('🧪 Testing anon key access...');
      const anonSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      const { data: buckets, error: listError } = await anonSupabase.storage.listBuckets();
      
      if (listError) {
        console.error('❌ Anon list error:', listError.message);
      } else {
        console.log('✅ Anon key buckets:', buckets.map(b => b.name));
        
        // Try uploading with anon key (as authenticated user would)
        console.log('🧪 Testing anon key upload...');
        const testContent = 'test upload after recreate';
        const testFile = new Blob([testContent], { type: 'text/plain' });
        
        const { data: uploadData, error: uploadError } = await anonSupabase.storage
          .from('photos')
          .upload('test/anon-test.txt', testFile, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) {
          console.error('❌ Anon upload error:', uploadError.message);
        } else {
          console.log('✅ Anon upload successful:', uploadData);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Recreate error:', error);
  }
}

recreateBucket();