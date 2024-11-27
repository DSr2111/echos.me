import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { login } from '../services/AuthService';

// Mock login function
jest.mock('../services/AuthService', () => ({
  login: jest.fn(),
}));

describe('Login Component', () => {
  const mockSetIsLoggedIn = jest.fn();

  it('renders the login form correctly', () => {
    render(
      <BrowserRouter>
        <Login setIsLoggedIn={mockSetIsLoggedIn} />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('displays an error message on login failure', async () => {
    login.mockRejectedValueOnce({ error: 'Invalid credentials' });

    render(
      <BrowserRouter>
        <Login setIsLoggedIn={mockSetIsLoggedIn} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });

  it('redirects the user on successful login', async () => {
    login.mockResolvedValueOnce({ token: 'fake-token' });

    const mockNavigate = jest.fn();
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate);

    render(
      <BrowserRouter>
        <Login setIsLoggedIn={mockSetIsLoggedIn} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    );
  });
});
