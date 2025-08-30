// Create storage policies via REST API
const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing credentials');
  process.exit(1);
}

async function executeSQL(sql, description) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${supabaseUrl}/rest/v1/rpc/exec_sql`);
    
    const postData = JSON.stringify({ sql });
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`${description}: Status ${res.statusCode}`);
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Success');
          resolve(data);
        } else {
          console.log('❌ Response:', data);
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function createPolicies() {
  console.log('🔐 Creating storage policies via API...');
  
  // First enable RLS
  await executeSQL(`
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  `, 'Enable RLS on storage.objects');
  
  // Create policies
  const policies = [
    `CREATE POLICY "Allow authenticated users to upload photos" ON storage.objects
     FOR INSERT TO authenticated
     WITH CHECK (bucket_id = 'photos')`,
     
    `CREATE POLICY "Allow public to view photos" ON storage.objects
     FOR SELECT TO public  
     USING (bucket_id = 'photos')`,
     
    `CREATE POLICY "Allow users to update photos" ON storage.objects
     FOR UPDATE TO authenticated
     USING (bucket_id = 'photos')
     WITH CHECK (bucket_id = 'photos')`,
     
    `CREATE POLICY "Allow users to delete photos" ON storage.objects
     FOR DELETE TO authenticated
     USING (bucket_id = 'photos')`
  ];
  
  for (let i = 0; i < policies.length; i++) {
    await executeSQL(policies[i], `Policy ${i + 1}`);
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

createPolicies();