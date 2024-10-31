import React, { useState } from 'react';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  startTime: number;
  isEditing: boolean;
}

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [nextId, setNextId] = useState(1);

  const startMatch = (homeTeam: string, awayTeam: string) => {
    if (!homeTeam || !awayTeam) return;

    const newMatch: Match = {
      id: nextId,
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      startTime: Date.now(),
      isEditing: false,
    };

    setMatches((prevMatches) => [...prevMatches, newMatch]);
    setNextId(nextId + 1);
  };

  const enableEditing = (id: number) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) =>
        match.id === id ? { ...match, isEditing: true } : match
      )
    );
  };

  const saveScore = (id: number, newHomeScore: number, newAwayScore: number) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) =>
        match.id === id
          ? { ...match, homeScore: newHomeScore, awayScore: newAwayScore, isEditing: false }
          : match
      )
    );
    reSortMatches();
  };

  const finishMatch = (id: number) => {
    setMatches((prevMatches) => prevMatches.filter((match) => match.id !== id));
  };

  const reSortMatches = () => {
    setMatches((prevMatches) =>
      [...prevMatches].sort(
        (a, b) =>
          b.homeScore + b.awayScore - (a.homeScore + a.awayScore) ||
          b.startTime - a.startTime
      )
    );
  };

  const Table: React.FC<{ matches: Match[] }> = React.memo(({ matches }) => {
    return (
      <>
        <h2>Ongoing Matches Summary</h2>
        {matches.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Home Team</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Score</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Away Team</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <MatchRow key={match.id} match={match} enableEditing={enableEditing} saveScore={saveScore} finishMatch={finishMatch} />
              ))}
            </tbody>
          </table>
        ) : (
          <p>No ongoing matches.</p>
        )}
      </>
    );
  });

  const MatchRow: React.FC<{ match: Match; enableEditing: (id: number) => void; saveScore: (id: number, homeScore: number, awayScore: number) => void; finishMatch: (id: number) => void }> = ({ match, enableEditing, saveScore, finishMatch }) => {
    const [homeScore, setHomeScore] = useState(match.homeScore);
    const [awayScore, setAwayScore] = useState(match.awayScore);

    return (
      <tr>
        <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{match.homeTeam}</td>
        <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
          {match.isEditing ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <input
                data-testid={`homeScore-${match.id}`}
                type="number"
                min="0"
                value={homeScore}
                onChange={(e) => setHomeScore(Number(e.target.value))}
                style={{ width: '40px', marginRight: '5px', textAlign: 'center' }}
              />
              <span>-</span>
              <input
                data-testid={`awayScore-${match.id}`}
                type="number"
                min="0"
                value={awayScore}
                onChange={(e) => setAwayScore(Number(e.target.value))}
                style={{ width: '40px', marginLeft: '5px', textAlign: 'center' }}
              />
            </div>
          ) : (
            <span style={{ width: '110px', display: 'inline-block', textAlign: 'center' }}>
              {match.homeScore} - {match.awayScore}
            </span>
          )}
        </td>
        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{match.awayTeam}</td>
        <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {match.isEditing ? (
              <button onClick={() => saveScore(match.id, homeScore, awayScore)}>Save</button>
            ) : (
              <button onClick={() => enableEditing(match.id)}>Update</button>
            )}
            <button onClick={() => finishMatch(match.id)}>Finish</button>
          </div>
        </td>
      </tr>
    );
  };

  const MatchForm: React.FC<{ startMatch: (homeTeam: string, awayTeam: string) => void }> = ({ startMatch }) => {
    const [homeTeam, setHomeTeam] = useState('');
    const [awayTeam, setAwayTeam] = useState('');
    return (
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
        <button
          onClick={() => startMatch(homeTeam, awayTeam)}
          style={{ marginLeft: '100px', padding: '4px 10px', fontSize: '16px' }}
          disabled={!awayTeam || !homeTeam}
        >
          Start Match
        </button>
      </div>
    );
  };

  return (
    <div>
      <h1>Live Football World Cup Scoreboard</h1>
      <MatchForm startMatch={startMatch} />
      <Table matches={matches} />
    </div>
  );
};

export default App;
