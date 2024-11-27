// client/src/components/Logout.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import { logout } from '../services/AuthService';

// Mock the AuthService and useNavigate
jest.mock('../services/AuthService', () => ({
  logout: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Logout Component', () => {
  let navigateMock;
  let setIsLoggedInMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    setIsLoggedInMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the logout button', () => {
    render(<Logout setIsLoggedIn={setIsLoggedInMock} />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  test('calls logout and redirects on successful logout', async () => {
    logout.mockResolvedValueOnce();

    render(<Logout setIsLoggedIn={setIsLoggedInMock} />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(logout).toHaveBeenCalledTimes(1);
    await screen.findByRole('button'); // Ensure DOM updates
    expect(setIsLoggedInMock).toHaveBeenCalledWith(false);
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  test('displays an error message on logout failure', async () => {
    logout.mockRejectedValueOnce(new Error('Logout failed'));

    jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock alert

    render(<Logout setIsLoggedIn={setIsLoggedInMock} />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(logout).toHaveBeenCalledTimes(1);
    await screen.findByRole('button'); // Ensure DOM updates
    expect(setIsLoggedInMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'Failed to log out. Please try again.'
    );

    window.alert.mockRestore(); // Restore original alert
  });
});
