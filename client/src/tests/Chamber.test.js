// client/src/components/Chamber.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import Chamber from './Chamber';

jest.mock('../services/supabaseClient');

describe('Chamber Component', () => {
  const mockChamber = {
    chamber_id: '1',
    name: 'Tech',
    language: 'en',
    category: 'technology',
    keywords: ['AI', 'ML'],
  };

  const mockArticles = [
    {
      title: 'Article 1',
      description: 'Description 1',
      url: 'https://example.com/1',
      image: 'image1.jpg',
    },
    {
      title: 'Article 2',
      description: 'Description 2',
      url: 'https://example.com/2',
      image: 'image2.jpg',
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders chamber details and articles', async () => {
    supabase.from.mockResolvedValueOnce({ data: mockChamber, error: null });
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: mockArticles }),
    });

    render(
      <MemoryRouter initialEntries={['/chambers/1']}>
        <Routes>
          <Route path="/chambers/:chamberId" element={<Chamber />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Tech')).toBeInTheDocument());

    await waitFor(() =>
      expect(screen.getByText('Article 1')).toBeInTheDocument()
    );
    expect(screen.getByText('Article 2')).toBeInTheDocument();
  });

  test('displays an error message when articles fail to load', async () => {
    supabase.from.mockResolvedValueOnce({ data: mockChamber, error: null });
    global.fetch = jest.fn().mockRejectedValue(new Error('Fetch failed'));

    render(
      <MemoryRouter initialEntries={['/chambers/1']}>
        <Routes>
          <Route path="/chambers/:chamberId" element={<Chamber />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText('Failed to load articles.')).toBeInTheDocument()
    );
  });

  test('favorites an article successfully', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
    });
    supabase.from.mockResolvedValue({ data: null, error: null });

    const mockArticle = {
      title: 'Article 1',
      description: 'Description 1',
      url: 'https://example.com/1',
    };

    render(
      <MemoryRouter initialEntries={['/chambers/1']}>
        <Routes>
          <Route path="/chambers/:chamberId" element={<Chamber />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Tech')).toBeInTheDocument());

    const heartIcon = screen.getByRole('button', { name: /favorite/i });
    fireEvent.click(heartIcon);

    await waitFor(() =>
      expect(
        screen.getByText('Article added to favorites!')
      ).toBeInTheDocument()
    );
  });
});
