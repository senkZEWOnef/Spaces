// Fix bucket permissions using service role
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

async function fixBucketPermissions() {
  console.log('🔧 Fixing bucket permissions...');
  
  try {
    // First, let's try to create bucket policies through the REST API
    console.log('📝 Creating bucket policies...');
    
    // Enable RLS on buckets table
    const { error: rlsError } = await supabase.rpc('exec', {
      sql: 'ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;'
    });
    
    if (rlsError) {
      console.log('⚠️  RLS error (might already be enabled):', rlsError.message);
    }
    
    // Create bucket policy to allow reading bucket info
    const { error: bucketPolicyError } = await supabase.rpc('exec', {
      sql: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'buckets' 
            AND policyname = 'Allow public to see buckets'
          ) THEN
            CREATE POLICY "Allow public to see buckets" ON storage.buckets
            FOR SELECT TO public
            USING (true);
          END IF;
        END $$;
      `
    });
    
    if (bucketPolicyError) {
      console.log('⚠️  Bucket policy error:', bucketPolicyError.message);
    } else {
      console.log('✅ Bucket policy created');
    }
    
    console.log('✅ Permissions fix completed');
    
    // Test with anon key now
    console.log('🧪 Testing with anon key...');
    const anonSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data: buckets, error } = await anonSupabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Anon key still can\'t list buckets:', error.message);
    } else {
      console.log('✅ Anon key can now see buckets:', buckets.map(b => b.name));
    }
    
  } catch (error) {
    console.error('❌ Fix error:', error);
  }
}

fixBucketPermissions();