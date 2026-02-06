import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

// Hardcoded for now - move back to env vars once working
const supabaseUrl = 'https://kohnhmqtrpsmvvnezpki.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvaG5obXF0cnBzbXZ2bmV6cGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNzY3MjEsImV4cCI6MjA4NTk1MjcyMX0.FNGYC6pTzr7Q6pjJABsKZWa8KbFMII3Z9yjAUyEQoF0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Refresh session when app comes to foreground
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
