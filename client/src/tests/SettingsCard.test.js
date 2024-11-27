// client/src/components/SettingsCard.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsCard from './SettingsCard';

describe('SettingsCard Component', () => {
  const onUpdateSettingsMock = jest.fn();
  const onCreateChamberMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders settings card with language and category options', () => {
    render(
      <SettingsCard
        onUpdateSettings={onUpdateSettingsMock}
        onCreateChamber={onCreateChamberMock}
      />
    );

    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByLabelText('Language:')).toBeInTheDocument();
    expect(screen.getByLabelText('Category:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create chamber/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hide/i })).toBeInTheDocument();
  });

  test('updates settings when update button is clicked', () => {
    render(
      <SettingsCard
        onUpdateSettings={onUpdateSettingsMock}
        onCreateChamber={onCreateChamberMock}
      />
    );

    fireEvent.change(screen.getByLabelText('Language:'), {
      target: { value: 'es' },
    });
    fireEvent.change(screen.getByLabelText('Category:'), {
      target: { value: 'sports' },
    });
    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    expect(onUpdateSettingsMock).toHaveBeenCalledWith({
      language: 'es',
      category: 'sports',
    });
  });

  test('creates a chamber when create chamber button is clicked', () => {
    global.prompt = jest.fn().mockReturnValue('My Chamber');
    render(
      <SettingsCard
        onUpdateSettings={onUpdateSettingsMock}
        onCreateChamber={onCreateChamberMock}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /create chamber/i }));

    expect(global.prompt).toHaveBeenCalledWith(
      'Enter a name for your Chamber:'
    );
    expect(onCreateChamberMock).toHaveBeenCalledWith({
      name: 'My Chamber',
      language: 'en',
      category: 'general',
    });
  });

  test('does not create a chamber when no name is provided', () => {
    global.prompt = jest.fn().mockReturnValue('');
    render(
      <SettingsCard
        onUpdateSettings={onUpdateSettingsMock}
        onCreateChamber={onCreateChamberMock}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /create chamber/i }));

    expect(global.prompt).toHaveBeenCalledWith(
      'Enter a name for your Chamber:'
    );
    expect(onCreateChamberMock).not.toHaveBeenCalled();
  });

  test('toggles visibility of settings card', () => {
    render(
      <SettingsCard
        onUpdateSettings={onUpdateSettingsMock}
        onCreateChamber={onCreateChamberMock}
      />
    );

    const hideButton = screen.getByRole('button', { name: /hide/i });
    fireEvent.click(hideButton);

    expect(screen.queryByText('Preferences')).not.toBeInTheDocument();

    const settingsTab = screen.getByRole('button', { name: /gear/i });
    fireEvent.click(settingsTab);

    expect(screen.getByText('Preferences')).toBeInTheDocument();
  });
});
