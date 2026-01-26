-- Migration: Add 'cargo' and fix 'profiles'
-- Description: Adds the missing 'cargo' column to the profiles table to fix the 400 Bad Request error.

DO $$
BEGIN
    -- Check if 'cargo' column exists in 'profiles'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'cargo') THEN
        ALTER TABLE profiles ADD COLUMN cargo VARCHAR(100);
    END IF;
    
    -- Check if 'organization_id' column exists, useful for multi-tenant features we are using
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'organization_id') THEN
        ALTER TABLE profiles ADD COLUMN organization_id UUID;
    END IF;
END $$;
