import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Scoreboard App', () => {
  test('allows typing in the Home Team input field', () => {
    render(<App />);
    const homeTeamInput = screen.getByPlaceholderText(/Enter Home Team/i);
    fireEvent.change(homeTeamInput, { target: { value: 'Mexico' } });
    expect(homeTeamInput).toHaveValue('Mexico');
  });

  test('allows typing in the Away Team input field', () => {
    render(<App />);
    const awayTeamInput = screen.getByPlaceholderText(/Enter Away Team/i);
    fireEvent.change(awayTeamInput, { target: { value: 'Canada' } });
    expect(awayTeamInput).toHaveValue('Canada');
  });
});
