import React from 'react';

// Helper: get dates for the past N days
function getPastDates(numDays) {
  const dates = [];
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export default function CalendarHeatmap({ completionMap, days = 30 }) {
  const dates = getPastDates(days);

  // Get color based on percentage
  function getColor(pct) {
    if (pct >= 99) return '#4caf50'; // green
    if (pct >= 66) return '#ffeb3b'; // yellow
    if (pct >= 33) return '#ff9800'; // orange
    return '#eee'; // light gray for no/low completion
  }

  return (
    <div style={{ display: 'flex', gap: 4, margin: '18px 0', flexWrap: 'wrap', justifyContent: 'center' }}>
      {dates.map(date => {
        const pct = completionMap[date] || 0;
        return (
          <div
            key={date}
            title={`${date}: ${pct}%`}
            style={{
              width: 22,
              height: 22,
              background: getColor(pct),
              borderRadius: 5,
              border: '1px solid #ddd',
              display: 'inline-block',
              transition: 'background 0.2s',
              boxShadow: pct >= 99 ? '0 0 6px #4caf5088' : undefined
            }}
          />
        );
      })}
    </div>
  );
}
