import { syncService } from '@/services/sync.service';
import { Session } from '@/types';

// Mock Supabase query builder
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockInsert = jest.fn();

// Chain builder for select queries
const createSelectChain = (data: any[], error: any = null) => ({
  eq: jest.fn().mockReturnValue({ data, error }),
});

// Chain builder for from().select().eq() pattern
const mockFrom = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
    auth: {
      onAuthStateChange: jest.fn(),
    },
  },
}));

const makeMockSession = (id: string, ratings: { cueId: string; rating: number }[] = []): Session => ({
  id,
  date: '2026-02-19T10:00:00Z',
  notes: 'Test session',
  cueRatings: ratings.map((r) => ({
    cueId: r.cueId,
    rating: r.rating,
  })),
});

describe('syncSessions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts new sessions that do not exist in cloud', async () => {
    const session = makeMockSession('session-new', [
      { cueId: 'cue-1', rating: 4 },
    ]);

    // Mock from('sessions').select('id').eq('user_id', userId) -> no existing sessions
    const sessionsSelectChain = { eq: jest.fn().mockReturnValue({ data: [], error: null }) };
    // Mock from('sessions').insert(...) -> success
    const sessionsInsertResult = { error: null };
    // Mock from('session_cue_ratings').insert(...) -> success
    const ratingsInsertResult = { error: null };

    mockFrom.mockImplementation((table: string) => {
      if (table === 'sessions') {
        return {
          select: jest.fn().mockReturnValue(sessionsSelectChain),
          insert: jest.fn().mockReturnValue(sessionsInsertResult),
        };
      }
      if (table === 'session_cue_ratings') {
        return {
          insert: jest.fn().mockReturnValue(ratingsInsertResult),
        };
      }
      return {};
    });

    const result = await syncService.syncSessions('user-1', [session]);

    expect(result).toEqual({ success: true });
    expect(mockFrom).toHaveBeenCalledWith('sessions');
    expect(mockFrom).toHaveBeenCalledWith('session_cue_ratings');
  });

  it('skips sessions that already exist in cloud', async () => {
    const existingSession = makeMockSession('session-existing', [
      { cueId: 'cue-1', rating: 3 },
    ]);

    // Track insert calls
    const sessionInsertMock = jest.fn().mockReturnValue({ error: null });
    const ratingsInsertMock = jest.fn().mockReturnValue({ error: null });

    const sessionsSelectChain = {
      eq: jest.fn().mockReturnValue({
        data: [{ id: 'session-existing' }],
        error: null,
      }),
    };

    mockFrom.mockImplementation((table: string) => {
      if (table === 'sessions') {
        return {
          select: jest.fn().mockReturnValue(sessionsSelectChain),
          insert: sessionInsertMock,
        };
      }
      if (table === 'session_cue_ratings') {
        return { insert: ratingsInsertMock };
      }
      return {};
    });

    const result = await syncService.syncSessions('user-1', [existingSession]);

    expect(result).toEqual({ success: true });
    // Session insert should NOT be called since it already exists
    expect(sessionInsertMock).not.toHaveBeenCalled();
    // Ratings insert should NOT be called either
    expect(ratingsInsertMock).not.toHaveBeenCalled();
  });

  it('handles mix of new and existing sessions', async () => {
    const existingSession = makeMockSession('session-old');
    const newSession = makeMockSession('session-new', [{ cueId: 'cue-1', rating: 5 }]);

    const sessionInsertMock = jest.fn().mockReturnValue({ error: null });
    const ratingsInsertMock = jest.fn().mockReturnValue({ error: null });

    const sessionsSelectChain = {
      eq: jest.fn().mockReturnValue({
        data: [{ id: 'session-old' }],
        error: null,
      }),
    };

    mockFrom.mockImplementation((table: string) => {
      if (table === 'sessions') {
        return {
          select: jest.fn().mockReturnValue(sessionsSelectChain),
          insert: sessionInsertMock,
        };
      }
      if (table === 'session_cue_ratings') {
        return { insert: ratingsInsertMock };
      }
      return {};
    });

    const result = await syncService.syncSessions('user-1', [existingSession, newSession]);

    expect(result).toEqual({ success: true });
    // Only the new session should be inserted
    expect(sessionInsertMock).toHaveBeenCalledTimes(1);
    expect(sessionInsertMock).toHaveBeenCalledWith({
      id: 'session-new',
      user_id: 'user-1',
      date: '2026-02-19T10:00:00Z',
      notes: 'Test session',
    });
  });

  it('silently ignores duplicate key errors (23505)', async () => {
    const session = makeMockSession('session-race', [{ cueId: 'cue-1', rating: 4 }]);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const sessionsSelectChain = {
      eq: jest.fn().mockReturnValue({ data: [], error: null }),
    };

    const sessionInsertMock = jest.fn().mockReturnValue({
      error: { code: '23505', message: 'duplicate key' },
    });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'sessions') {
        return {
          select: jest.fn().mockReturnValue(sessionsSelectChain),
          insert: sessionInsertMock,
        };
      }
      return {};
    });

    const result = await syncService.syncSessions('user-1', [session]);

    expect(result).toEqual({ success: true });
    // Should not log duplicate key errors
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('logs non-duplicate session insert errors', async () => {
    const session = makeMockSession('session-err');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const sessionsSelectChain = {
      eq: jest.fn().mockReturnValue({ data: [], error: null }),
    };

    const sessionInsertMock = jest.fn().mockReturnValue({
      error: { code: '42501', message: 'RLS violation' },
    });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'sessions') {
        return {
          select: jest.fn().mockReturnValue(sessionsSelectChain),
          insert: sessionInsertMock,
        };
      }
      return {};
    });

    const result = await syncService.syncSessions('user-1', [session]);

    expect(result).toEqual({ success: true });
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error inserting session:',
      expect.objectContaining({ code: '42501' })
    );
    consoleSpy.mockRestore();
  });

  it('does not insert ratings if session insert fails', async () => {
    const session = makeMockSession('session-fail', [{ cueId: 'cue-1', rating: 3 }]);
    jest.spyOn(console, 'error').mockImplementation();

    const ratingsInsertMock = jest.fn().mockReturnValue({ error: null });

    const sessionsSelectChain = {
      eq: jest.fn().mockReturnValue({ data: [], error: null }),
    };

    mockFrom.mockImplementation((table: string) => {
      if (table === 'sessions') {
        return {
          select: jest.fn().mockReturnValue(sessionsSelectChain),
          insert: jest.fn().mockReturnValue({
            error: { code: '42501', message: 'RLS violation' },
          }),
        };
      }
      if (table === 'session_cue_ratings') {
        return { insert: ratingsInsertMock };
      }
      return {};
    });

    await syncService.syncSessions('user-1', [session]);

    // Ratings insert should NOT be called when session insert fails
    expect(ratingsInsertMock).not.toHaveBeenCalled();
    jest.restoreAllMocks();
  });

  it('handles empty session list', async () => {
    const sessionsSelectChain = {
      eq: jest.fn().mockReturnValue({ data: [], error: null }),
    };

    mockFrom.mockImplementation((table: string) => {
      if (table === 'sessions') {
        return {
          select: jest.fn().mockReturnValue(sessionsSelectChain),
        };
      }
      return {};
    });

    const result = await syncService.syncSessions('user-1', []);

    expect(result).toEqual({ success: true });
  });

  it('returns error on unexpected exception', async () => {
    mockFrom.mockImplementation(() => {
      throw new Error('Network failure');
    });

    const result = await syncService.syncSessions('user-1', [
      makeMockSession('session-1'),
    ]);

    expect(result).toEqual({ success: false, error: 'Network failure' });
  });
});
