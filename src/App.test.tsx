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

  test('displays message when there are no ongoing matches', () => {
    render(<App />);
    expect(screen.getByText(/no ongoing matches/i)).toBeInTheDocument();
  });

  test('starts a match and displays it in the scoreboard', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/home team/i), { target: { value: 'Canada' } });
    fireEvent.change(screen.getByLabelText(/away team/i), { target: { value: 'Japan' } });
    fireEvent.click(screen.getByText(/start match/i));

    expect(screen.getByText(/canada/i)).toBeInTheDocument();
    expect(screen.getByText(/japan/i)).toBeInTheDocument();
    expect(screen.getByText(/0 - 0/i)).toBeInTheDocument();
  });

  test('updates score of an ongoing match', () => {
    render(<App />);
    
    fireEvent.change(screen.getByLabelText(/home team/i), { target: { value: 'Canada' } });
    fireEvent.change(screen.getByLabelText(/away team/i), { target: { value: 'Japan' } });
    fireEvent.click(screen.getByText(/start match/i));

    fireEvent.click(screen.getByText(/update/i));
    
    const homeScoreInput = screen.getByTestId('homeScore-1');
    const awayScoreInput = screen.getByTestId('awayScore-1');

    fireEvent.change(homeScoreInput, { target: { value: '2' } });
    fireEvent.change(awayScoreInput, { target: { value: '0' } });

    fireEvent.click(screen.getByText(/save/i));
    expect(screen.getByText(/2 - 0/i)).toBeInTheDocument();
  });

  test('finishes a match and removes it from the scoreboard', () => {
    render(<App />);
    
    fireEvent.change(screen.getByLabelText(/home team/i), { target: { value: 'France' } });
    fireEvent.change(screen.getByLabelText(/away team/i), { target: { value: 'Belgium' } });
    fireEvent.click(screen.getByText(/start match/i));

    fireEvent.click(screen.getByText(/finish/i));

    expect(screen.queryByText(/france/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/belgium/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/0 - 0/i)).not.toBeInTheDocument();
  });

});
