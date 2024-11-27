// client/src/components/Navbar.test.js

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppNavbar from './Navbar';

describe('AppNavbar Component', () => {
  const mockHandleLogout = jest.fn();

  const renderNavbar = (isLoggedIn) =>
    render(
      <BrowserRouter>
        <AppNavbar isLoggedIn={isLoggedIn} handleLogout={mockHandleLogout} />
      </BrowserRouter>
    );

  test('renders brand and login/signup links when logged out', () => {
    renderNavbar(false);

    expect(screen.getByText('echos.me')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.queryByText('News')).not.toBeInTheDocument();
  });

  test('renders navigation links when logged in', () => {
    renderNavbar(true);

    expect(screen.getByText('echos.me')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('Chambers')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('calls handleLogout when Logout is clicked', () => {
    renderNavbar(true);

    fireEvent.click(screen.getByText('Logout'));

    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });
});
