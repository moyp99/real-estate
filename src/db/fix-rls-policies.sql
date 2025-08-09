-- Fix RLS policies to use user_role instead of user_type
-- Run this script in your Supabase SQL editor to fix the permission error

-- ==========================================
-- Step 1: Drop existing conflicting policies
-- ==========================================

-- Drop the old policies that reference user_type
DROP POLICY IF EXISTS "Agents can create properties" ON public.properties;
DROP POLICY IF EXISTS "Agents can update own properties" ON public.properties;
DROP POLICY IF EXISTS "Agents can manage property images" ON public.property_images;

-- ==========================================
-- Step 2: Create updated policies using user_role
-- ==========================================

-- Properties: Agents can create properties (using user_role column)
CREATE POLICY "Agents can create properties" ON public.properties
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'agent')
    );

-- Properties: Agents can update their own properties
CREATE POLICY "Agents can update own properties" ON public.properties
    FOR UPDATE USING (agent_id = auth.uid());

-- Property images: Agents can manage images for their properties
CREATE POLICY "Agents can manage property images" ON public.property_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.properties 
            WHERE id = property_images.property_id 
            AND agent_id = auth.uid()
        )
    );


