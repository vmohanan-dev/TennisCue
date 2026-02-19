import { useAuthStore } from '@/store/authStore';

// Mock Supabase
const mockRefreshSession = jest.fn();
const mockGetSession = jest.fn();
const mockSignOut = jest.fn();
const mockFunctionsInvoke = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      refreshSession: (...args: any[]) => mockRefreshSession(...args),
      getSession: (...args: any[]) => mockGetSession(...args),
      signOut: (...args: any[]) => mockSignOut(...args),
      onAuthStateChange: jest.fn(),
      getUser: jest.fn(),
    },
    functions: {
      invoke: (...args: any[]) => mockFunctionsInvoke(...args),
    },
  },
}));

// Mock dependent stores
const mockClearSessions = jest.fn();
const mockResetOnboarding = jest.fn();

jest.mock('@/store/sessionStore', () => ({
  useSessionStore: {
    getState: () => ({
      clearSessions: mockClearSessions,
    }),
  },
}));

jest.mock('@/store/userStore', () => ({
  useUserStore: {
    getState: () => ({
      resetOnboarding: mockResetOnboarding,
    }),
  },
}));

describe('deleteAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset store state
    useAuthStore.setState({
      user: { id: 'test-user-id', email: 'test@example.com' } as any,
      session: { access_token: 'test-token' } as any,
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  });

  it('successfully deletes account and clears all local data', async () => {
    mockRefreshSession.mockResolvedValue({ data: {}, error: null });
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'fresh-token' } },
    });
    mockFunctionsInvoke.mockResolvedValue({ data: { success: true }, error: null });
    mockSignOut.mockResolvedValue({});

    const result = await useAuthStore.getState().deleteAccount();

    expect(result).toEqual({ success: true });

    // Verify edge function was called correctly
    expect(mockFunctionsInvoke).toHaveBeenCalledWith('delete-user', {
      method: 'POST',
    });

    // Verify local stores were cleared
    expect(mockClearSessions).toHaveBeenCalled();
    expect(mockResetOnboarding).toHaveBeenCalled();

    // Verify sign out was called
    expect(mockSignOut).toHaveBeenCalled();

    // Verify auth state was reset
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('clears local stores before signing out', async () => {
    const callOrder: string[] = [];
    mockRefreshSession.mockResolvedValue({ data: {}, error: null });
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'fresh-token' } },
    });
    mockFunctionsInvoke.mockResolvedValue({ data: { success: true }, error: null });
    mockClearSessions.mockImplementation(() => callOrder.push('clearSessions'));
    mockResetOnboarding.mockImplementation(() => callOrder.push('resetOnboarding'));
    mockSignOut.mockImplementation(() => {
      callOrder.push('signOut');
      return Promise.resolve({});
    });

    await useAuthStore.getState().deleteAccount();

    expect(callOrder).toEqual(['clearSessions', 'resetOnboarding', 'signOut']);
  });

  it('returns error when session refresh fails', async () => {
    mockRefreshSession.mockResolvedValue({
      data: {},
      error: { message: 'Refresh token expired' },
    });

    const result = await useAuthStore.getState().deleteAccount();

    expect(result).toEqual({
      success: false,
      error: 'Session expired. Please sign in again.',
    });
    expect(mockFunctionsInvoke).not.toHaveBeenCalled();
    expect(mockClearSessions).not.toHaveBeenCalled();
    expect(mockResetOnboarding).not.toHaveBeenCalled();

    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(false);
  });

  it('returns error when no active session after refresh', async () => {
    mockRefreshSession.mockResolvedValue({ data: {}, error: null });
    mockGetSession.mockResolvedValue({
      data: { session: null },
    });

    const result = await useAuthStore.getState().deleteAccount();

    expect(result).toEqual({
      success: false,
      error: 'No active session. Please sign in again.',
    });
    expect(mockFunctionsInvoke).not.toHaveBeenCalled();
    expect(mockClearSessions).not.toHaveBeenCalled();
  });

  it('returns error when edge function fails with parseable error', async () => {
    mockRefreshSession.mockResolvedValue({ data: {}, error: null });
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'fresh-token' } },
    });

    const mockResponse = {
      text: jest.fn().mockResolvedValue(JSON.stringify({ error: 'User not found' })),
    };
    mockFunctionsInvoke.mockResolvedValue({
      data: null,
      error: { name: 'FunctionsHttpError', message: 'non-2xx', context: mockResponse },
      response: mockResponse,
    });

    const result = await useAuthStore.getState().deleteAccount();

    expect(result).toEqual({ success: false, error: 'User not found' });
    expect(mockClearSessions).not.toHaveBeenCalled();
    expect(mockResetOnboarding).not.toHaveBeenCalled();
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it('returns generic error when edge function fails with unparseable response', async () => {
    mockRefreshSession.mockResolvedValue({ data: {}, error: null });
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'fresh-token' } },
    });

    mockFunctionsInvoke.mockResolvedValue({
      data: null,
      error: { name: 'FunctionsRelayError', message: 'relay error' },
      response: null,
    });

    const result = await useAuthStore.getState().deleteAccount();

    expect(result).toEqual({
      success: false,
      error: 'Account deletion is not available right now. Please try again later.',
    });
  });

  it('does not clear local stores when edge function fails', async () => {
    mockRefreshSession.mockResolvedValue({ data: {}, error: null });
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'fresh-token' } },
    });
    mockFunctionsInvoke.mockResolvedValue({
      data: null,
      error: { name: 'FunctionsHttpError', message: 'server error' },
      response: null,
    });

    await useAuthStore.getState().deleteAccount();

    expect(mockClearSessions).not.toHaveBeenCalled();
    expect(mockResetOnboarding).not.toHaveBeenCalled();
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it('handles unexpected exceptions gracefully', async () => {
    mockRefreshSession.mockRejectedValue(new Error('Network error'));

    const result = await useAuthStore.getState().deleteAccount();

    expect(result).toEqual({
      success: false,
      error: 'Network error',
    });

    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(false);
  });

  it('sets isLoading to true during deletion', async () => {
    mockRefreshSession.mockImplementation(async () => {
      // Check loading state mid-execution
      expect(useAuthStore.getState().isLoading).toBe(true);
      return { data: {}, error: { message: 'fail' } };
    });

    await useAuthStore.getState().deleteAccount();

    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('does not send custom Authorization header to functions.invoke', async () => {
    mockRefreshSession.mockResolvedValue({ data: {}, error: null });
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'fresh-token' } },
    });
    mockFunctionsInvoke.mockResolvedValue({ data: { success: true }, error: null });
    mockSignOut.mockResolvedValue({});

    await useAuthStore.getState().deleteAccount();

    // Should only pass method, no custom headers
    const invokeArgs = mockFunctionsInvoke.mock.calls[0];
    expect(invokeArgs[0]).toBe('delete-user');
    expect(invokeArgs[1]).toEqual({ method: 'POST' });
    expect(invokeArgs[1]).not.toHaveProperty('headers');
  });
});
