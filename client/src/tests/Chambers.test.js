// client/src/pages/Chambers.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import Chambers from './Chambers';

jest.mock('../services/supabaseClient');

describe('Chambers Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Chambers page and shows empty message when no chambers exist', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    supabase.from.mockResolvedValue({ data: [], error: null });

    render(
      <MemoryRouter>
        <Chambers />
      </MemoryRouter>
    );

    expect(screen.getByText('Your Chambers')).toBeInTheDocument();
    expect(screen.getByText(/Explore and manage your personalized chambers/)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/No chambers found. Create one to get started!/)).toBeInTheDocument()
    );
  });

  test('renders a list of chambers', async () => {
    const mockChambers = [
      { chamber_id: '1', name: 'Tech', language: 'en', category: 'technology', keywords: ['AI'] },
      { chamber_id: '2', name: 'Health', language: 'es', category: 'health', keywords: ['Fitness'] },
    ];

    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    supabase.from.mockResolvedValue({ data: mockChambers, error: null });

    render(
      <MemoryRouter>
        <Chambers />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText('Tech')).toBeInTheDocument()
    );
    expect(screen.getByText('Health')).toBeInTheDocument();
  });

  test('deletes a chamber when the delete button is clicked', async () => {
    const mockChambers = [
      { chamber_id: '1', name: 'Tech', language: 'en', category: 'technology', keywords: ['AI'] },
    ];

    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    supabase.from.mockResolvedValueOnce({ data: mockChambers, error: null });
    supabase.from.mockResolvedValueOnce({ error: null });

    render(
      <MemoryRouter>
        <Chambers />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText('Tech')).toBeInTheDocument()
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(screen.queryByText('Tech')).not.toBeInTheDocument()
    );
  });
});