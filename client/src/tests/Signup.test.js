import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../pages/Signup';
import { supabase } from '../services/supabaseClient';

// Mock Supabase client
jest.mock('../services/supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn(),
  eq: jest.fn(),
  auth: { signUp: jest.fn() },
}));

describe('Signup Component', () => {
  it('renders the signup form correctly', () => {
    render(<Signup />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();
  });

  it('validates username availability', async () => {
    supabase.select.mockResolvedValueOnce({ data: [], error: null });

    render(<Signup />);
    const usernameInput = screen.getByLabelText(/username/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    await waitFor(() =>
      expect(screen.getByText(/username is available!/i)).toBeInTheDocument()
    );
  });

  it('disables the submit button if username is unavailable', async () => {
    supabase.select.mockResolvedValueOnce({
      data: [{ username: 'testuser' }],
      error: null,
    });

    render(<Signup />);
    const usernameInput = screen.getByLabelText(/username/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    await waitFor(() =>
      expect(screen.getByText(/username is taken/i)).toBeInTheDocument()
    );
    expect(submitButton).toBeDisabled();
  });

  it('calls the supabase API on form submission', async () => {
    supabase.auth.signUp.mockResolvedValueOnce({
      data: { user: { id: '123' } },
      error: null,
    });
    supabase.from.mockResolvedValueOnce({ error: null });

    render(<Signup />);
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => expect(supabase.auth.signUp).toHaveBeenCalled());
  });
});
