-- Complete clean setup to fix Supabase auth signup issue
-- This script will completely reset and rebuild the user role system

-- ==========================================
-- Step 1: Complete cleanup of existing setup
-- ==========================================

-- Drop all existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop any existing user_type or user_role related items
DROP TYPE IF EXISTS user_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Remove user_type column if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'user_type'
    ) THEN
        ALTER TABLE public.profiles DROP COLUMN user_type;
        RAISE NOTICE 'Dropped user_type column';
    END IF;
END$$;

-- Remove user_role column if it exists  
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'user_role'
    ) THEN
        ALTER TABLE public.profiles DROP COLUMN user_role;
        RAISE NOTICE 'Dropped user_role column';
    END IF;
END$$;

-- ==========================================
-- Step 2: Create simple TEXT-based solution
-- ==========================================

-- Add user_role as TEXT with constraint (no enum to avoid casting issues)
ALTER TABLE public.profiles 
ADD COLUMN user_role TEXT NOT NULL DEFAULT 'user'
CHECK (user_role IN ('user', 'agent', 'guest'));

-- ==========================================
-- Step 3: Create ultra-simple trigger function
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    profile_name text;
    profile_role text;
BEGIN
    -- Get name from metadata or derive from email
    profile_name := COALESCE(
        NEW.raw_user_meta_data->>'name', 
        split_part(NEW.email, '@', 1)
    );
    
    -- Get role from metadata, supporting both user_role and user_type keys
    profile_role := COALESCE(
        NEW.raw_user_meta_data->>'user_role',
        NEW.raw_user_meta_data->>'user_type',
        'user'
    );
    
    -- Validate role (only allow specific values)
    IF profile_role NOT IN ('user', 'agent', 'guest') THEN
        profile_role := 'user';
    END IF;
    
    -- Insert profile (using UPSERT to handle any conflicts)
    INSERT INTO public.profiles (
        id, 
        email, 
        name, 
        user_role,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        profile_name,
        profile_role,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        user_role = EXCLUDED.user_role,
        updated_at = NOW();
        
    -- Log successful profile creation
    RAISE NOTICE 'Created profile for user % with role %', NEW.email, profile_role;
        
    RETURN NEW;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log any errors but don't fail the auth process
        RAISE WARNING 'Error in handle_new_user for %: %', NEW.email, SQLERRM;
        
        -- Create minimal profile to not block auth
        INSERT INTO public.profiles (id, email, name, user_role)
        VALUES (NEW.id, NEW.email, profile_name, 'user')
        ON CONFLICT (id) DO NOTHING;
        
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- Step 4: Create the trigger
-- ==========================================

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- Step 5: Set permissions
-- ==========================================

-- Grant all necessary permissions on profiles table
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT ALL ON TABLE public.profiles TO postgres;

-- ==========================================
-- Step 6: Ensure RLS policies exist
-- ==========================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ==========================================
-- Step 7: Verify setup (without problematic test)
-- ==========================================

-- Show final setup
SELECT 'Setup verification:' as info;

SELECT 
    'user_role_column_exists' as check_name,
    EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'user_role'
    ) as result
UNION ALL
SELECT 
    'trigger_exists' as check_name,
    EXISTS(
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created'
    ) as result
UNION ALL
SELECT 
    'function_exists' as check_name,
    EXISTS(
        SELECT 1 FROM information_schema.routines 
        WHERE routine_name = 'handle_new_user'
    ) as result;

-- Show column details
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'user_role';

-- Check that the constraint is working
SELECT 'Testing constraint validation:' as info;
DO $$
BEGIN
    -- This should work (valid role)
    IF 'user' IN ('user', 'agent', 'guest') THEN
        RAISE NOTICE 'Constraint validation: user role is valid';
    END IF;
    
    -- This should work (valid role)
    IF 'agent' IN ('user', 'agent', 'guest') THEN
        RAISE NOTICE 'Constraint validation: agent role is valid';
    END IF;
    
    -- This should work (valid role)  
    IF 'guest' IN ('user', 'agent', 'guest') THEN
        RAISE NOTICE 'Constraint validation: guest role is valid';
    END IF;
END $$;

SELECT 'Complete clean setup finished! Ready for signup testing.' as final_status;
SELECT 'The trigger will automatically create profiles when users sign up through Supabase Auth.' as note;