import React from 'react';

const DAYS_SHOWN = 84; // 12 weeks

function getIntensityClass(count) {
  if (!count || count === 0) return 'bg-gray-100';
  if (count === 1) return 'bg-green-200';
  if (count === 2) return 'bg-green-400';
  if (count <= 4) return 'bg-green-600';
  return 'bg-green-700';
}

export default function ActivityHeatmap({ heatmap = [] }) {
  // Build a map from date -> count
  const countByDate = {};
  heatmap.forEach(({ date, count }) => {
    countByDate[date] = count;
  });

  // Generate the last DAYS_SHOWN days
  const days = [];
  for (let i = DAYS_SHOWN - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    days.push({ date: key, count: countByDate[key] || 0 });
  }

  // Group into weeks (columns of 7)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Activity</h3>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} contributions`}
                className={`w-3 h-3 rounded-sm ${getIntensityClass(day.count)} transition-opacity hover:opacity-70 cursor-default`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
        <span>Less</span>
        {['bg-gray-100', 'bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-700'].map(cls => (
          <div key={cls} className={`w-3 h-3 rounded-sm ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
