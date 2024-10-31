import React, { useState } from 'react';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  startTime: number;
}

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [nextId, setNextId] = useState(1);

  // Start a new match
  const startMatch = () => {
    if (!homeTeam || !awayTeam) return;

    const newMatch: Match = {
      id: nextId,
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      startTime: Date.now(),
    };

    setMatches([...matches, newMatch]);
    setNextId(nextId + 1);
    setHomeTeam('');
    setAwayTeam('');
  };

  return (
    <div>
      <h1>Live Football World Cup Scoreboard</h1>

      <div>
        <h2>Start a New Match</h2>
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
          <label htmlFor="homeTeam" style={{ width: '100px' }}>Home Team</label>
          <input
            id="homeTeam"
            type="text"
            placeholder="Enter Home Team"
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            style={{ padding: '5px', width: '200px' }}
          />
        </div>
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
          <label htmlFor="awayTeam" style={{ width: '100px' }}>Away Team</label>
          <input
            id="awayTeam"
            type="text"
            placeholder="Enter Away Team"
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            style={{ padding: '5px', width: '200px' }}
          />
        </div>
        <button onClick={startMatch} style={{ marginLeft:'100px', padding: '4px 10px', fontSize: '16px' }}>
          Start Match
        </button>
      </div>
    </div>
  );
};

export default App;
