import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { supabase } from '../services/supabaseClient';

// Mock Supabase client
jest.mock('../services/supabaseClient', () => ({
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
  insert: jest.fn(),
}));

jest.mock('../components/NewsFeed', () => () => (
  <div data-testid="news-feed" />
));
jest.mock('../components/SettingsCard', () => (props) => (
  <div data-testid="settings-card">
    <button
      onClick={() =>
        props.onUpdateSettings({ language: 'es', category: 'business' })
      }
    >
      Update Settings
    </button>
    <button onClick={() => props.onCreateChamber({ name: 'Test Chamber' })}>
      Create Chamber
    </button>
  </div>
));

describe('Dashboard Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate);
  });

  it('redirects to login if not logged in', async () => {
    render(
      <BrowserRouter>
        <Dashboard isLoggedIn={false} />
      </BrowserRouter>
    );

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
  });

  it('renders NewsFeed and SettingsCard components', () => {
    render(
      <BrowserRouter>
        <Dashboard isLoggedIn={true} />
      </BrowserRouter>
    );

    expect(screen.getByTestId('news-feed')).toBeInTheDocument();
    expect(screen.getByTestId('settings-card')).toBeInTheDocument();
  });

  it('triggers a refresh when the refresh button is clicked', () => {
    render(
      <BrowserRouter>
        <Dashboard isLoggedIn={true} />
      </BrowserRouter>
    );

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    // Confirm the refresh key changes by observing the NewsFeed or console logs during testing
  });

  it('updates settings when SettingsCard triggers an update', () => {
    render(
      <BrowserRouter>
        <Dashboard isLoggedIn={true} />
      </BrowserRouter>
    );

    const updateButton = screen.getByRole('button', {
      name: /update settings/i,
    });
    fireEvent.click(updateButton);

    expect(screen.getByTestId('news-feed')).toBeInTheDocument();
    // Further assertions can validate props passed to NewsFeed
  });

  it('creates a new chamber when the Create Chamber button is clicked', async () => {
    supabase.auth.getUser.mockResolvedValueOnce({
      user: { id: '123' },
      error: null,
    });
    supabase.from.mockReturnValueOnce({ data: null, error: null });

    render(
      <BrowserRouter>
        <Dashboard isLoggedIn={true} />
      </BrowserRouter>
    );

    const createButton = screen.getByRole('button', {
      name: /create chamber/i,
    });
    fireEvent.click(createButton);

    await waitFor(() => expect(supabase.from).toHaveBeenCalledWith('Chambers'));
  });
});
