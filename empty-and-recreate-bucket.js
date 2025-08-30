// Empty bucket and recreate with proper settings
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

async function emptyAndRecreateBucket() {
  console.log('🧹 Emptying and recreating photos bucket...');
  
  try {
    // List all files in the bucket
    console.log('📁 Listing files in bucket...');
    const { data: files, error: listError } = await serviceSupabase.storage
      .from('photos')
      .list('', {
        limit: 100,
        offset: 0
      });
    
    if (listError) {
      console.error('❌ List error:', listError);
      return;
    }
    
    console.log(`Found ${files.length} files to delete`);
    
    // Delete all files
    if (files.length > 0) {
      const filesToDelete = files.map(file => file.name);
      console.log('🗑️  Deleting files:', filesToDelete);
      
      const { error: deleteFilesError } = await serviceSupabase.storage
        .from('photos')
        .remove(filesToDelete);
        
      if (deleteFilesError) {
        console.error('❌ Delete files error:', deleteFilesError);
      } else {
        console.log('✅ Files deleted');
      }
    }
    
    // Check subdirectories and delete them too
    const { data: allFiles, error: listAllError } = await serviceSupabase.storage
      .from('photos')
      .list('test', {
        limit: 100
      });
      
    if (!listAllError && allFiles.length > 0) {
      const testFilesToDelete = allFiles.map(file => `test/${file.name}`);
      console.log('🗑️  Deleting test files:', testFilesToDelete);
      
      const { error: deleteTestError } = await serviceSupabase.storage
        .from('photos')
        .remove(testFilesToDelete);
        
      if (deleteTestError) {
        console.error('❌ Delete test files error:', deleteTestError);
      } else {
        console.log('✅ Test files deleted');
      }
    }
    
    // Now delete the bucket
    console.log('🗑️  Deleting empty bucket...');
    const { error: deleteBucketError } = await serviceSupabase.storage.deleteBucket('photos');
    
    if (deleteBucketError) {
      console.error('❌ Delete bucket error:', deleteBucketError);
      return;
    }
    
    console.log('✅ Bucket deleted');
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create new bucket
    console.log('🏗️  Creating new photos bucket...');
    const { data: newBucket, error: createError } = await serviceSupabase.storage.createBucket('photos', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 10 * 1024 * 1024 // 10MB
    });
    
    if (createError) {
      console.error('❌ Create bucket error:', createError);
      return;
    }
    
    console.log('✅ New bucket created:', newBucket);
    
    // Test immediately with service key
    console.log('🧪 Testing service key upload...');
    const testContent = 'test after recreation';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    
    const { data: serviceUpload, error: serviceUploadError } = await serviceSupabase.storage
      .from('photos')
      .upload('test/service-recreate.txt', testFile, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (serviceUploadError) {
      console.error('❌ Service upload error:', serviceUploadError);
    } else {
      console.log('✅ Service upload successful:', serviceUpload);
    }
    
  } catch (error) {
    console.error('❌ Empty and recreate error:', error);
  }
}

emptyAndRecreateBucket();