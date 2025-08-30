// Create storage policies using service role key
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createStoragePolicies() {
  console.log('🔐 Creating storage policies...');

  const policies = [
    {
      name: 'Allow authenticated users to upload photos',
      sql: `
        CREATE POLICY "Allow authenticated users to upload photos" ON storage.objects
        FOR INSERT TO authenticated
        WITH CHECK (bucket_id = 'photos');
      `
    },
    {
      name: 'Allow public to view photos', 
      sql: `
        CREATE POLICY "Allow public to view photos" ON storage.objects
        FOR SELECT TO public
        USING (bucket_id = 'photos');
      `
    },
    {
      name: 'Allow users to update their photos',
      sql: `
        CREATE POLICY "Allow users to update their photos" ON storage.objects  
        FOR UPDATE TO authenticated
        USING (bucket_id = 'photos')
        WITH CHECK (bucket_id = 'photos');
      `
    },
    {
      name: 'Allow users to delete their photos',
      sql: `
        CREATE POLICY "Allow users to delete their photos" ON storage.objects
        FOR DELETE TO authenticated  
        USING (bucket_id = 'photos');
      `
    }
  ];

  for (const policy of policies) {
    try {
      console.log(`Creating: ${policy.name}`);
      const { error } = await supabase.rpc('sql', { query: policy.sql });
      
      if (error) {
        console.log(`⚠️  ${policy.name}:`, error.message);
      } else {
        console.log(`✅ ${policy.name}: Created`);
      }
    } catch (err) {
      console.log(`⚠️  ${policy.name}:`, err.message);
    }
  }
}

createStoragePolicies();