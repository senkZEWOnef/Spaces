-- ShareSpace Database Setup Script
-- Run this in your new Supabase SQL Editor

-- ============================================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- ============================================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. CREATE STORAGE BUCKET FOR PHOTOS
-- ============================================================================

-- Create storage bucket for photos (run this in Supabase Dashboard -> Storage)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('photos', 'photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- ============================================================================
-- 3. CREATE TABLES
-- ============================================================================

-- Users table (extends auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spaces table (photo albums/events)
CREATE TABLE public.spaces (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    date DATE NOT NULL, -- Event date
    image_url TEXT, -- Cover image
    is_public BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    uploads INTEGER DEFAULT 0
);

-- Photos table
CREATE TABLE public.photos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    uploader_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    uploader_name TEXT, -- For anonymous uploads
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Co-hosts table (users who can manage a space)
CREATE TABLE public.cohosts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(space_id, user_id)
);

-- Comments table (optional - for photo comments)
CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    photo_id UUID REFERENCES public.photos(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Spaces indexes
CREATE INDEX idx_spaces_created_by ON public.spaces(created_by);
CREATE INDEX idx_spaces_is_public ON public.spaces(is_public);
CREATE INDEX idx_spaces_slug ON public.spaces(slug);
CREATE INDEX idx_spaces_created_at ON public.spaces(created_at DESC);

-- Photos indexes
CREATE INDEX idx_photos_space_id ON public.photos(space_id);
CREATE INDEX idx_photos_uploader_id ON public.photos(uploader_id);
CREATE INDEX idx_photos_is_approved ON public.photos(is_approved);
CREATE INDEX idx_photos_created_at ON public.photos(created_at DESC);

-- Cohosts indexes
CREATE INDEX idx_cohosts_space_id ON public.cohosts(space_id);
CREATE INDEX idx_cohosts_user_id ON public.cohosts(user_id);

-- Comments indexes
CREATE INDEX idx_comments_photo_id ON public.comments(photo_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);

-- ============================================================================
-- 5. CREATE FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_spaces_updated_at
    BEFORE UPDATE ON public.spaces
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_photos_updated_at
    BEFORE UPDATE ON public.photos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Function to check if user can manage space
CREATE OR REPLACE FUNCTION user_can_manage_space(space_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user is the creator or a co-host
    RETURN EXISTS (
        SELECT 1 FROM public.spaces 
        WHERE id = space_uuid AND created_by = user_uuid
    ) OR EXISTS (
        SELECT 1 FROM public.cohosts 
        WHERE space_id = space_uuid AND user_id = user_uuid
    ) OR EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = user_uuid AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Spaces policies
CREATE POLICY "Anyone can view public spaces" ON public.spaces
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own spaces" ON public.spaces
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Co-hosts can view managed spaces" ON public.spaces
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cohosts 
            WHERE space_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create spaces" ON public.spaces
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Space owners can update their spaces" ON public.spaces
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Co-hosts can update managed spaces" ON public.spaces
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.cohosts 
            WHERE space_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Space owners can delete their spaces" ON public.spaces
    FOR DELETE USING (auth.uid() = created_by);

-- Photos policies
CREATE POLICY "Anyone can view approved photos in public spaces" ON public.photos
    FOR SELECT USING (
        is_approved = true AND 
        EXISTS (
            SELECT 1 FROM public.spaces 
            WHERE id = space_id AND is_public = true
        )
    );

CREATE POLICY "Space managers can view all photos in their spaces" ON public.photos
    FOR SELECT USING (
        user_can_manage_space(space_id, auth.uid())
    );

CREATE POLICY "Users can view their own photos" ON public.photos
    FOR SELECT USING (auth.uid() = uploader_id);

CREATE POLICY "Anyone can upload photos to spaces" ON public.photos
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.spaces WHERE id = space_id)
    );

CREATE POLICY "Space managers can update photos" ON public.photos
    FOR UPDATE USING (
        user_can_manage_space(space_id, auth.uid())
    );

CREATE POLICY "Users can update their own photos" ON public.photos
    FOR UPDATE USING (auth.uid() = uploader_id);

CREATE POLICY "Space managers can delete photos" ON public.photos
    FOR DELETE USING (
        user_can_manage_space(space_id, auth.uid())
    );

-- Cohosts policies
CREATE POLICY "Space owners can manage co-hosts" ON public.cohosts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.spaces 
            WHERE id = space_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can view co-host relationships" ON public.cohosts
    FOR SELECT USING (
        auth.uid() = user_id OR 
        user_can_manage_space(space_id, auth.uid())
    );

-- Comments policies
CREATE POLICY "Anyone can view comments on approved photos" ON public.comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.photos p
            JOIN public.spaces s ON p.space_id = s.id
            WHERE p.id = photo_id 
            AND p.is_approved = true 
            AND s.is_public = true
        )
    );

CREATE POLICY "Space managers can view all comments" ON public.comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.photos p
            WHERE p.id = photo_id 
            AND user_can_manage_space(p.space_id, auth.uid())
        )
    );

CREATE POLICY "Authenticated users can add comments" ON public.comments
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.photos p
            JOIN public.spaces s ON p.space_id = s.id
            WHERE p.id = photo_id 
            AND p.is_approved = true
        )
    );

CREATE POLICY "Users can update their own comments" ON public.comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Space managers can delete comments" ON public.comments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.photos p
            WHERE p.id = photo_id 
            AND user_can_manage_space(p.space_id, auth.uid())
        )
    );

-- ============================================================================
-- 7. STORAGE POLICIES
-- ============================================================================

-- Storage policies for photos bucket
-- (Run these in Supabase Dashboard -> Storage -> photos bucket -> Policies)

/*
-- Allow anyone to view photos
CREATE POLICY "Anyone can view photos" ON storage.objects
FOR SELECT USING (bucket_id = 'photos');

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'photos' AND 
    auth.role() = 'authenticated'
);

-- Allow users to update their own photos or space managers
CREATE POLICY "Users can update own photos or space managers" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'photos' AND (
        auth.uid()::text = (storage.foldername(name))[1] OR
        EXISTS (
            SELECT 1 FROM public.spaces s
            JOIN public.photos p ON p.space_id = s.id
            WHERE p.url LIKE '%' || name || '%' 
            AND (s.created_by = auth.uid() OR 
                 EXISTS (SELECT 1 FROM public.cohosts WHERE space_id = s.id AND user_id = auth.uid())
            )
        )
    )
);

-- Allow users to delete their own photos or space managers
CREATE POLICY "Users can delete own photos or space managers" ON storage.objects
FOR DELETE USING (
    bucket_id = 'photos' AND (
        auth.uid()::text = (storage.foldername(name))[1] OR
        EXISTS (
            SELECT 1 FROM public.spaces s
            JOIN public.photos p ON p.space_id = s.id
            WHERE p.url LIKE '%' || name || '%' 
            AND (s.created_by = auth.uid() OR 
                 EXISTS (SELECT 1 FROM public.cohosts WHERE space_id = s.id AND user_id = auth.uid())
            )
        )
    )
);
*/

-- ============================================================================
-- 8. SAMPLE DATA (OPTIONAL)
-- ============================================================================

-- Insert sample admin user (update with your email)
-- INSERT INTO public.users (id, email, full_name, role)
-- VALUES (
--     gen_random_uuid(),
--     'your-email@example.com', -- CHANGE THIS
--     'Admin User',
--     'admin'
-- );

-- Sample space
-- INSERT INTO public.spaces (name, slug, description, date, is_public, created_by)
-- VALUES (
--     'Sample Wedding',
--     'sample-wedding-2024',
--     'Beautiful memories from John & Jane''s special day',
--     '2024-06-15',
--     true,
--     (SELECT id FROM public.users WHERE email = 'your-email@example.com' LIMIT 1)
-- );

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================

-- Your database is now ready!
-- Don't forget to:
-- 1. Create the storage bucket 'photos' in Supabase Dashboard
-- 2. Set up storage policies in the Storage section
-- 3. Update your .env.local with the new Supabase credentials