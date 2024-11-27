import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FavoritedArticles from '../pages/FavoritedArticles';
import { supabase } from '../services/supabaseClient';

// Mock Supabase client
jest.mock('../services/supabaseClient', () => ({
  auth: {
    getSession: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn(),
  delete: jest.fn(),
  eq: jest.fn(),
}));

describe('FavoritedArticles Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays a loading message while fetching articles', () => {
    render(<FavoritedArticles />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('displays an error message if fetching favorites fails', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: '123' } } },
    });
    supabase.from.mockReturnValueOnce({
      error: new Error('Fetch failed'),
      data: null,
    });

    render(<FavoritedArticles />);

    await waitFor(() =>
      expect(
        screen.getByText(/failed to load your favorite articles/i)
      ).toBeInTheDocument()
    );
  });

  it('fetches and displays favorite articles correctly', async () => {
    const mockFavorites = [
      {
        favorite_id: '1',
        url: 'http://example.com/article1',
        title: 'Article 1',
        image_url: 'http://example.com/image1.jpg',
        description: 'This is the first article.',
      },
      {
        favorite_id: '2',
        url: 'http://example.com/article2',
        title: 'Article 2',
        image_url: null,
        description: 'This is the second article.',
      },
    ];

    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: '123' } } },
    });
    supabase.from.mockReturnValueOnce({ data: mockFavorites, error: null });

    render(<FavoritedArticles />);

    await waitFor(() => {
      expect(screen.getByText(/article 1/i)).toBeInTheDocument();
      expect(screen.getByText(/article 2/i)).toBeInTheDocument();
      expect(
        screen.getByText(/this is the first article/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/this is the second article/i)
      ).toBeInTheDocument();
    });
  });

  it('removes a favorite article when the remove button is clicked', async () => {
    const mockFavorites = [
      {
        favorite_id: '1',
        url: 'http://example.com/article1',
        title: 'Article 1',
        image_url: 'http://example.com/image1.jpg',
        description: 'This is the first article.',
      },
    ];

    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: '123' } } },
    });
    supabase.from.mockReturnValueOnce({ data: mockFavorites, error: null });
    supabase.from.mockReturnValueOnce({ error: null });

    render(<FavoritedArticles />);

    await waitFor(() =>
      expect(screen.getByText(/article 1/i)).toBeInTheDocument()
    );

    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    await waitFor(() =>
      expect(screen.queryByText(/article 1/i)).not.toBeInTheDocument()
    );
  });
});
