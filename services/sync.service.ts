import { supabase } from '@/lib/supabase';
import { SkillLevel, QuizAnswer, Session, CueRating } from '@/types';

export interface UserProfileData {
  level: SkillLevel | null;
  hasCompletedOnboarding: boolean;
  activeCueIds: string[];
  quizAnswers: QuizAnswer[];
}

export interface SyncResult {
  success: boolean;
  error?: string;
}

export const syncService = {
  // Sync user profile to Supabase
  async syncUserProfile(userId: string, data: UserProfileData): Promise<SyncResult> {
    try {
      // Upsert profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          level: data.level,
          has_completed_onboarding: data.hasCompletedOnboarding,
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Error syncing profile:', profileError);
        return { success: false, error: profileError.message };
      }

      // Sync active cues - delete existing and insert new
      const { error: deleteError } = await supabase
        .from('user_active_cues')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error deleting active cues:', deleteError);
      }

      if (data.activeCueIds.length > 0) {
        const activeCuesData = data.activeCueIds.map((cueId) => ({
          user_id: userId,
          cue_id: cueId,
        }));

        const { error: insertError } = await supabase
          .from('user_active_cues')
          .insert(activeCuesData);

        if (insertError) {
          console.error('Error inserting active cues:', insertError);
          return { success: false, error: insertError.message };
        }
      }

      // Sync quiz answers - delete existing and insert new
      const { error: deleteQuizError } = await supabase
        .from('quiz_answers')
        .delete()
        .eq('user_id', userId);

      if (deleteQuizError) {
        console.error('Error deleting quiz answers:', deleteQuizError);
      }

      if (data.quizAnswers.length > 0) {
        const quizData = data.quizAnswers.map((answer) => ({
          user_id: userId,
          question_id: answer.questionId,
          answer_id: answer.answerId,
          points: answer.points,
        }));

        const { error: insertQuizError } = await supabase
          .from('quiz_answers')
          .insert(quizData);

        if (insertQuizError) {
          console.error('Error inserting quiz answers:', insertQuizError);
          return { success: false, error: insertQuizError.message };
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in syncUserProfile:', error);
      return { success: false, error: error.message };
    }
  },

  // Fetch user profile from Supabase
  async fetchUserProfile(userId: string): Promise<UserProfileData | null> {
    try {
      // Get profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // Get active cues
      const { data: activeCues, error: cuesError } = await supabase
        .from('user_active_cues')
        .select('cue_id')
        .eq('user_id', userId);

      if (cuesError) {
        console.error('Error fetching active cues:', cuesError);
      }

      // Get quiz answers
      const { data: quizAnswers, error: quizError } = await supabase
        .from('quiz_answers')
        .select('*')
        .eq('user_id', userId);

      if (quizError) {
        console.error('Error fetching quiz answers:', quizError);
      }

      return {
        level: profile?.level || null,
        hasCompletedOnboarding: profile?.has_completed_onboarding || false,
        activeCueIds: activeCues?.map((c) => c.cue_id) || [],
        quizAnswers:
          quizAnswers?.map((a) => ({
            questionId: a.question_id,
            answerId: a.answer_id,
            points: a.points,
          })) || [],
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  },

  // Sync sessions to Supabase
  async syncSessions(userId: string, sessions: Session[]): Promise<SyncResult> {
    try {
      for (const session of sessions) {
        // Check if session already exists
        const { data: existing } = await supabase
          .from('sessions')
          .select('id')
          .eq('id', session.id)
          .single();

        if (!existing) {
          // Insert new session
          const { error: sessionError } = await supabase.from('sessions').insert({
            id: session.id,
            user_id: userId,
            date: session.date,
            notes: session.notes,
          });

          if (sessionError) {
            console.error('Error inserting session:', sessionError);
            continue;
          }

          // Insert session ratings
          if (session.cueRatings.length > 0) {
            const ratingsData = session.cueRatings.map((rating) => ({
              session_id: session.id,
              cue_id: rating.cueId,
              rating: rating.rating,
            }));

            const { error: ratingsError } = await supabase
              .from('session_cue_ratings')
              .insert(ratingsData);

            if (ratingsError) {
              console.error('Error inserting ratings:', ratingsError);
            }
          }
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in syncSessions:', error);
      return { success: false, error: error.message };
    }
  },

  // Fetch sessions from Supabase
  async fetchSessions(userId: string): Promise<Session[]> {
    try {
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        return [];
      }

      const result: Session[] = [];

      for (const session of sessions || []) {
        const { data: ratings, error: ratingsError } = await supabase
          .from('session_cue_ratings')
          .select('*')
          .eq('session_id', session.id);

        if (ratingsError) {
          console.error('Error fetching ratings:', ratingsError);
        }

        result.push({
          id: session.id,
          date: session.date,
          notes: session.notes,
          cueRatings:
            ratings?.map((r) => ({
              cueId: r.cue_id,
              rating: r.rating,
            })) || [],
        });
      }

      return result;
    } catch (error) {
      console.error('Error in fetchSessions:', error);
      return [];
    }
  },

  // Merge local data with cloud data (local takes precedence for conflicts)
  mergeUserData(
    localData: UserProfileData,
    cloudData: UserProfileData | null
  ): UserProfileData {
    if (!cloudData) {
      return localData;
    }

    // If local has completed onboarding, use local data
    if (localData.hasCompletedOnboarding) {
      return localData;
    }

    // If cloud has completed onboarding but local hasn't, use cloud
    if (cloudData.hasCompletedOnboarding && !localData.hasCompletedOnboarding) {
      return cloudData;
    }

    return localData;
  },

  // Merge sessions (combine unique sessions from both sources)
  mergeSessions(localSessions: Session[], cloudSessions: Session[]): Session[] {
    const sessionMap = new Map<string, Session>();

    // Add cloud sessions first
    for (const session of cloudSessions) {
      sessionMap.set(session.id, session);
    }

    // Override with local sessions (local takes precedence)
    for (const session of localSessions) {
      sessionMap.set(session.id, session);
    }

    // Sort by date descending
    return Array.from(sessionMap.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },
};
