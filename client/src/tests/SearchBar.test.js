// client/src/components/SearchBar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  test('renders search bar with input and button', () => {
    render(<SearchBar onSearch={jest.fn()} />);

    expect(
      screen.getByPlaceholderText('Search articles...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('calls onSearch with query when button is clicked', () => {
    const onSearchMock = jest.fn();
    render(<SearchBar onSearch={onSearchMock} />);

    const input = screen.getByPlaceholderText('Search articles...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.click(button);

    expect(onSearchMock).toHaveBeenCalledWith(['React']);
    expect(input.value).toBe('');
  });

  test('calls onSearch with query when Enter key is pressed', () => {
    const onSearchMock = jest.fn();
    render(<SearchBar onSearch={onSearchMock} />);

    const input = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(input, { target: { value: 'JavaScript' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onSearchMock).toHaveBeenCalledWith(['JavaScript']);
    expect(input.value).toBe('');
  });

  test('does not call onSearch when input is empty', () => {
    const onSearchMock = jest.fn();
    render(<SearchBar onSearch={onSearchMock} />);

    const button = screen.getByRole('button', { name: /search/i });
    fireEvent.click(button);

    expect(onSearchMock).not.toHaveBeenCalled();
  });
});
