import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch for login, PATCH, and habits endpoints
const today = new Date().toISOString().slice(0, 10);
const username = 'testuser';
const userId = '507f1f77bcf86cd799439011';
const habits = [
  { _id: 'h1', existingAction: 'Wake up', newAction: 'Drink water' },
  { _id: 'h2', existingAction: 'Eat breakfast', newAction: 'Take vitamins' }
];

let dailyState = { date: today, completedHabits: [], score: 0, completionPct: 0 };

beforeEach(() => {
  // Reset mocks and localStorage
  jest.spyOn(window, 'fetch').mockImplementation((url, opts) => {
    if (url.includes('/api/users/' + username) && !opts) {
      // GET /api/users/:username
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ _id: userId, username, dailyState })
      });
    }
    if (url.includes('/api/habits?user=')) {
      // GET habits
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(habits)
      });
    }
    if (url.endsWith(`/api/users/${username}/daily`)) {
      // PATCH daily state
      const body = JSON.parse(opts.body);
      dailyState = { ...dailyState, ...body };
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ dailyState })
      });
    }
    return Promise.reject(new Error('Unknown endpoint: ' + url));
  });
  window.localStorage.clear();
  dailyState = { date: today, completedHabits: [], score: 0, completionPct: 0 };
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('daily score and completion percentage persist after logout/login', async () => {
  render(<App />);

  // Login as testuser
  fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: username } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // Wait for habits to load
  await waitFor(() => expect(screen.getByText(/your habits for today/i)).toBeInTheDocument());

  // Complete first habit
  const firstCheckbox = screen.getAllByRole('checkbox')[0];
  fireEvent.click(firstCheckbox);

  // Check score and completion percentage updated
  await waitFor(() => {
    expect(screen.getByText(/daily score/i)).toHaveTextContent('Daily Score: 1');
    expect(screen.getByText(/completion/i)).toHaveTextContent('Completion: 50%');
  });

  // Logout
  fireEvent.click(screen.getByRole('button', { name: /logout/i }));

  // Login again
  fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: username } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // Wait for habits to load and state to restore
  await waitFor(() => {
    expect(screen.getByText(/daily score/i)).toHaveTextContent('Daily Score: 1');
    expect(screen.getByText(/completion/i)).toHaveTextContent('Completion: 50%');
  });
});
