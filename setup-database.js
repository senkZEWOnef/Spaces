#!/usr/bin/env node

// Simple database setup script for Spaces
// Run with: node setup-database.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Setting up Spaces database...\n');

  try {
    // Test connection
    console.log('1. Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Tables not found. Please run the SQL setup script first.');
        console.log('\n📋 To set up your database:');
        console.log('1. Go to your Supabase Dashboard → SQL Editor');
        console.log('2. Copy and run the SQL from supabase_setup.sql');
        console.log('3. Create a storage bucket named "photos"');
        console.log('4. Run this script again');
        return;
      } else {
        throw error;
      }
    }

    console.log('✅ Database connection successful');
    console.log(`📊 Current user count: ${data.count || 0}`);

    // Test other tables
    const tables = ['spaces', 'photos', 'cohosts'];
    for (const table of tables) {
      try {
        const { count } = await supabase.from(table).select('count', { count: 'exact', head: true });
        console.log(`✅ ${table} table: ${count || 0} rows`);
      } catch (err) {
        console.log(`❌ ${table} table: Error - ${err.message}`);
      }
    }

    // Test storage
    console.log('\n2. Testing storage...');
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const photosBucket = buckets?.find(b => b.name === 'photos');
      
      if (photosBucket) {
        console.log('✅ Photos storage bucket exists');
      } else {
        console.log('❌ Photos storage bucket missing');
        console.log('   Please create a public bucket named "photos" in your Supabase dashboard');
      }
    } catch (storageError) {
      console.log('❌ Storage error:', storageError.message);
    }

    console.log('\n🎉 Database setup verification complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Try creating an account');
    console.log('3. Create your first space');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    
    if (error.message.includes('Invalid API key')) {
      console.log('\n💡 Check your .env.local file:');
      console.log('- NEXT_PUBLIC_SUPABASE_URL should be your project URL');
      console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY should be your anon/public key');
    }
  }
}

setupDatabase();