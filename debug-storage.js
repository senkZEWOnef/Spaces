// Debug script to test Supabase storage connection
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugStorage() {
  console.log('🔍 Debugging Supabase Storage...');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
  
  try {
    // List all buckets
    console.log('\n📦 Listing all buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
    } else {
      console.log('✅ Buckets found:', buckets.map(b => b.name));
      
      // Check if 'photos' bucket exists
      const photoBucket = buckets.find(b => b.name === 'photos');
      if (photoBucket) {
        console.log('✅ "photos" bucket found:', photoBucket);
        
        // Try to list files in the bucket
        console.log('\n📁 Testing bucket access...');
        const { data: files, error: filesError } = await supabase.storage
          .from('photos')
          .list();
          
        if (filesError) {
          console.error('❌ Error accessing photos bucket:', filesError);
        } else {
          console.log('✅ Successfully accessed photos bucket, files:', files?.length || 0);
        }
      } else {
        console.log('❌ "photos" bucket NOT found!');
      }
    }
  } catch (error) {
    console.error('❌ General error:', error);
  }
}

debugStorage();