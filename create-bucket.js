// Script to create storage bucket via direct API call
const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const url = new URL(`${supabaseUrl}/storage/v1/bucket`);

const bucketData = JSON.stringify({
  id: 'photos',
  name: 'photos',
  public: true,
  file_size_limit: 10485760,
  allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
});

const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${supabaseKey}`,
    'apikey': supabaseKey,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(bucketData)
  }
};

console.log('🚀 Creating photos bucket...');

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response status:', res.statusCode);
    
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ Bucket created successfully!');
      console.log('Response:', data);
    } else if (res.statusCode === 409) {
      console.log('✅ Bucket already exists!');
    } else {
      console.log('❌ Error creating bucket:');
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
});

req.write(bucketData);
req.end();