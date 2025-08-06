-- Fix for user_type enum error

-- First, check if the enum already exists
DO $$ 
BEGIN
    -- Create the user_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
        CREATE TYPE user_type AS ENUM ('user', 'agent', 'guest');
    END IF;
END$$;

-- Make sure the profiles table has the user_type column
DO $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'user_type'
    ) THEN
        -- Add the column if it doesn't exist
        ALTER TABLE public.profiles 
        ADD COLUMN user_type user_type NOT NULL DEFAULT 'user';
    END IF;
END$$;

-- Update the handle_new_user function to properly handle user_type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, user_type)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        COALESCE((new.raw_user_meta_data->>'user_type')::user_type, 'user')
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        user_type = EXCLUDED.user_type;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();