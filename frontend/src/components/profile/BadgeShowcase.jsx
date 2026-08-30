import React from 'react';

export default function BadgeShowcase({ badges = [] }) {
  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);

  if (!badges.length) {
    return (
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Badges</h3>
        <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
          <div className="text-4xl mb-3 opacity-30">🏅</div>
          <h4 className="font-bold text-gray-500 mb-1">No badges yet</h4>
          <p className="text-xs text-gray-400 max-w-xs">Complete issues and maintain streaks to unlock your first badge!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
        Badges <span className="text-google-blue font-normal normal-case">({earned.length}/{badges.length})</span>
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {/* Earned badges first */}
        {earned.map((badge) => (
          <div
            key={badge.id}
            title={badge.description}
            className="flex flex-col items-center p-3 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-shadow cursor-default text-center"
          >
            {badge.icon_url ? (
              <img src={badge.icon_url} alt={badge.name} className="w-16 h-20 mb-2 drop-shadow-sm" />
            ) : (
              <span className="text-3xl mb-1.5">{badge.icon}</span>
            )}
            <span className="text-xs font-semibold text-gray-800 leading-tight">{badge.name}</span>
          </div>
        ))}

        {/* Locked badges — grayed out */}
        {locked.map((badge) => (
          <div
            key={badge.id}
            title={`Locked: ${badge.condition}`}
            className="flex flex-col items-center p-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 cursor-default text-center opacity-40 grayscale"
          >
            {badge.icon_url ? (
              <img src={badge.icon_url} alt={badge.name} className="w-16 h-20 mb-2 drop-shadow-none" />
            ) : (
              <span className="text-3xl mb-1.5">{badge.icon}</span>
            )}
            <span className="text-xs font-semibold text-gray-400 leading-tight">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
