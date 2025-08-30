// Debug bucket with service role key
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

async function debugBucketService() {
  console.log('🔍 Debugging with service role key...');
  
  try {
    // List all buckets with service key
    console.log('📦 Listing buckets with service key...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Service key bucket error:', bucketsError);
    } else {
      console.log('✅ Service key buckets:', buckets.map(b => `${b.name} (${b.public ? 'public' : 'private'})`));
      
      // Check if photos bucket exists
      const photoBucket = buckets.find(b => b.name === 'photos');
      if (photoBucket) {
        console.log('✅ Photos bucket found:', photoBucket);
        
        // Try to list files in photos bucket
        const { data: files, error: filesError } = await supabase.storage
          .from('photos')
          .list();
          
        if (filesError) {
          console.error('❌ Error listing photos:', filesError);
        } else {
          console.log('✅ Photos bucket accessible, files:', files?.length || 0);
        }
      } else {
        console.log('❌ Photos bucket NOT found in service key results!');
      }
    }
  } catch (error) {
    console.error('❌ Service debug error:', error);
  }
}

debugBucketService();