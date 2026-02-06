-- TennisCue Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  has_completed_onboarding BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User's active cues
CREATE TABLE IF NOT EXISTS public.user_active_cues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cue_id TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, cue_id)
);

-- Quiz answers
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  answer_id TEXT NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Practice sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id TEXT PRIMARY KEY, -- Using TEXT to match app's session ID format
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session cue ratings
CREATE TABLE IF NOT EXISTS public.session_cue_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  cue_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  UNIQUE(session_id, cue_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_active_cues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_cue_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_active_cues
CREATE POLICY "Users can view own active cues" ON public.user_active_cues
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own active cues" ON public.user_active_cues
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own active cues" ON public.user_active_cues
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for quiz_answers
CREATE POLICY "Users can view own quiz answers" ON public.quiz_answers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz answers" ON public.quiz_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own quiz answers" ON public.quiz_answers
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for sessions
CREATE POLICY "Users can view own sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON public.sessions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for session_cue_ratings
CREATE POLICY "Users can view own session ratings" ON public.session_cue_ratings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = session_cue_ratings.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own session ratings" ON public.session_cue_ratings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = session_cue_ratings.session_id
      AND sessions.user_id = auth.uid()
    )
  );

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_active_cues_user_id ON public.user_active_cues(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_user_id ON public.quiz_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON public.sessions(date DESC);
CREATE INDEX IF NOT EXISTS idx_session_cue_ratings_session_id ON public.session_cue_ratings(session_id);
