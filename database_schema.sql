-- VedicVision Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Note: Row Level Security is enabled by default in Supabase

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    health_goals TEXT[] DEFAULT '{}',
    subscribe_newsletter BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create BMI calculations table
CREATE TABLE IF NOT EXISTS public.bmi_calculations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    height DECIMAL(5,2) NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    activity_level TEXT NOT NULL,
    bmi_value DECIMAL(4,1) NOT NULL,
    bmi_category TEXT NOT NULL,
    health_goals TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create diet plans table
CREATE TABLE IF NOT EXISTS public.diet_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    diet_type TEXT NOT NULL,
    weekly_plan JSONB NOT NULL,
    calories_per_day INTEGER,
    health_goals TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create exercise plans table (for future use)
CREATE TABLE IF NOT EXISTS public.exercise_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    plan_name TEXT NOT NULL,
    exercises JSONB NOT NULL,
    duration_minutes INTEGER,
    difficulty_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bmi_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for BMI calculations
CREATE POLICY "Users can view own BMI calculations" ON public.bmi_calculations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own BMI calculations" ON public.bmi_calculations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for diet plans
CREATE POLICY "Users can view own diet plans" ON public.diet_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diet plans" ON public.diet_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for exercise plans
CREATE POLICY "Users can view own exercise plans" ON public.exercise_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise plans" ON public.exercise_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);
CREATE INDEX IF NOT EXISTS bmi_calculations_user_id_idx ON public.bmi_calculations(user_id);
CREATE INDEX IF NOT EXISTS bmi_calculations_created_at_idx ON public.bmi_calculations(created_at DESC);
CREATE INDEX IF NOT EXISTS diet_plans_user_id_idx ON public.diet_plans(user_id);
CREATE INDEX IF NOT EXISTS diet_plans_created_at_idx ON public.diet_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS exercise_plans_user_id_idx ON public.exercise_plans(user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
