// client/src/components/NewsFeed.test.js

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import NewsFeed from './NewsFeed';

describe('NewsFeed Component', () => {
  const mockFetchArticles = jest.fn();
  const mockHandleFavorite = jest.fn();
  const mockHandleShare = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderNewsFeed = (props) =>
    render(
      <NewsFeed
        refreshKey={props.refreshKey || 0}
        settings={props.settings || { language: 'en', category: 'general' }}
        onKeywordUpdate={props.onKeywordUpdate || jest.fn()}
        useCachedData={props.useCachedData || false}
      />
    );

  test('renders loading spinner during data fetch', () => {
    renderNewsFeed({ loading: true });

    expect(screen.getByText('Loading news...')).toBeInTheDocument();
  });

  test('renders articles correctly', async () => {
    renderNewsFeed({
      articles: [
        { title: 'Article 1', url: 'https://example.com/1', image: null },
        { title: 'Article 2', url: 'https://example.com/2', image: null },
      ],
    });

    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
  });

  test('handles empty results gracefully', () => {
    renderNewsFeed({ articles: [] });

    expect(
      screen.getByText(
        'No articles found for your current settings. Please adjust your preferences.'
      )
    ).toBeInTheDocument();
  });

  test('handles keyword search', () => {
    const mockOnKeywordUpdate = jest.fn();
    renderNewsFeed({ onKeywordUpdate: mockOnKeywordUpdate });

    fireEvent.change(screen.getByPlaceholderText('Search articles...'), {
      target: { value: 'test' },
    });
    fireEvent.keyDown(screen.getByPlaceholderText('Search articles...'), {
      key: 'Enter',
      code: 'Enter',
    });

    expect(mockOnKeywordUpdate).toHaveBeenCalledWith(['test']);
  });

  test('favorites an article', async () => {
    renderNewsFeed({
      articles: [{ title: 'Test Article', url: 'https://example.com' }],
    });

    const favoriteIcon = screen.getByRole('button', { name: /favorite/i });
    fireEvent.click(favoriteIcon);

    expect(mockHandleFavorite).toHaveBeenCalled();
  });

  test('shares an article', async () => {
    renderNewsFeed({
      articles: [{ title: 'Test Article', url: 'https://example.com' }],
    });

    const shareIcon = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareIcon);

    expect(mockHandleShare).toHaveBeenCalled();
  });
});
