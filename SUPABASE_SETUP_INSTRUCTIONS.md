# 🚀 ShareSpace Supabase Setup Guide

Follow these steps to set up your new Supabase project for ShareSpace.

## 📋 Prerequisites

1. Create a new project in [Supabase Dashboard](https://supabase.com/dashboard)
2. Note down your project credentials

## 🔧 Step 1: Update Environment Variables

Update your `.env.local` file with your new Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Firebase Configuration (keep existing)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-key
# ... other Firebase config
```

## 🗄️ Step 2: Run Database Setup Script

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the entire content from `supabase_setup.sql`
4. Paste and run the script

This will create:
- ✅ All required tables (users, spaces, photos, cohosts, comments)
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Triggers and functions
- ✅ User registration automation

## 🪣 Step 3: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Name it: `photos`
4. Make it **Public**
5. Set file size limit: **10MB**
6. Add allowed MIME types:
   - `image/jpeg`
   - `image/png` 
   - `image/webp`
   - `image/gif`

## 🛡️ Step 4: Set Storage Policies

In the **Storage** section, click on your `photos` bucket, then **Policies**, and add these:

### Policy 1: Allow anyone to view photos
```sql
CREATE POLICY "Anyone can view photos" ON storage.objects
FOR SELECT USING (bucket_id = 'photos');
```

### Policy 2: Allow authenticated users to upload
```sql
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'photos' AND 
    auth.role() = 'authenticated'
);
```

### Policy 3: Allow users to update their photos
```sql
CREATE POLICY "Users can manage their uploads" ON storage.objects
FOR UPDATE USING (bucket_id = 'photos' AND auth.role() = 'authenticated');
```

### Policy 4: Allow users to delete their photos
```sql
CREATE POLICY "Users can delete their uploads" ON storage.objects
FOR DELETE USING (bucket_id = 'photos' AND auth.role() = 'authenticated');
```

## 👤 Step 5: Configure Authentication

1. Go to **Authentication** → **Settings**
2. **Site URL**: Add your domain (e.g., `http://localhost:3000` for development)
3. **Redirect URLs**: Add your callback URLs
4. **Email Templates**: Customize if needed

### Enable Auth Providers (Optional)
- Email/Password: ✅ Already enabled
- Google: Configure if needed
- GitHub: Configure if needed

## 🔐 Step 6: Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter your email and password
4. After creation, go to **SQL Editor** and run:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## 🧪 Step 7: Test Your Setup

1. Start your development server: `npm run dev`
2. Try to:
   - ✅ Register a new user
   - ✅ Log in
   - ✅ Create a space
   - ✅ Upload a photo
   - ✅ View the gallery

## 📁 Database Schema Overview

### Tables Created:
- **users**: User profiles and roles
- **spaces**: Photo albums/events  
- **photos**: Uploaded images with approval status
- **cohosts**: Space collaboration management
- **comments**: Photo comments (optional)

### Key Features:
- 🔒 **Row Level Security**: Proper access control
- 🎭 **Role-based permissions**: Admin vs regular users
- 🤝 **Collaboration**: Co-host system for shared management
- 📝 **Moderation**: Photo approval workflow
- 🔄 **Real-time**: Built-in Supabase real-time capabilities

## 🚨 Troubleshooting

### Common Issues:

**1. "relation does not exist" errors**
- Make sure you ran the complete SQL setup script
- Check that all tables were created in the **Database** → **Tables** section

**2. "insufficient privileges" errors**
- Verify RLS policies are set correctly
- Check user authentication status

**3. Upload failures**
- Confirm storage bucket `photos` exists and is public
- Verify storage policies are applied

**4. Environment variable errors**
- Double-check your `.env.local` file
- Restart your development server after changes

### Getting Help:
1. Check Supabase logs in Dashboard → **Logs**
2. Verify policies in Dashboard → **Authentication** → **Policies**
3. Test queries in **SQL Editor**

## ✅ Verification Checklist

Before going live, verify:
- [ ] Database tables created successfully
- [ ] Storage bucket `photos` exists with proper policies
- [ ] Authentication works (register/login)
- [ ] Space creation works
- [ ] Photo upload works
- [ ] RLS policies prevent unauthorized access
- [ ] Admin features work with admin role

---

🎉 **Your ShareSpace database is now ready!** 

The app should now work with your new Supabase project. All the modern features we implemented (upload, moderation, user management, etc.) will work seamlessly with this setup.