-- Quick fix for the user_type enum error
-- Run these commands one by one in Supabase SQL editor

-- Step 1: Create the enum type (if it doesn't exist)
CREATE TYPE user_type AS ENUM ('user', 'agent', 'guest');

-- Step 2: If you get an error that the type already exists, skip step 1 and run this instead:
-- ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'agent';
-- ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'guest';

-- Step 3: Ensure the profiles table has the user_type column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type user_type NOT NULL DEFAULT 'user';

-- Step 4: Update any existing profiles that might be missing user_type
UPDATE public.profiles 
SET user_type = 'user' 
WHERE user_type IS NULL;