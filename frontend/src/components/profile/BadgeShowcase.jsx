import React from 'react';
import { Award, Star, Zap, Target, Flame, Trophy } from 'lucide-react';

const BADGE_ICONS = {
  default: Award,
  streak: Flame,
  speed: Zap,
  accuracy: Target,
  milestone: Trophy,
  featured: Star,
};

const BADGE_COLORS = {
  gold: 'bg-yellow-50 border-yellow-200 text-yellow-600',
  silver: 'bg-gray-50 border-gray-200 text-gray-500',
  bronze: 'bg-orange-50 border-orange-200 text-orange-500',
  blue: 'bg-blue-50 border-blue-200 text-blue-600',
};

export default function BadgeShowcase({ badges = [] }) {
  if (!badges.length) {
    return (
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Badges</h3>
        <div className="text-center py-8 text-gray-400">
          <Award size={40} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Complete issues to earn your first badge!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Badges</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {badges.map((badge) => {
          const Icon = BADGE_ICONS[badge.type] || BADGE_ICONS.default;
          const colorClass = BADGE_COLORS[badge.color] || BADGE_COLORS.blue;
          return (
            <div
              key={badge.id}
              title={badge.description}
              className={`flex flex-col items-center p-3 rounded-xl border ${colorClass} text-center hover:shadow-sm transition-shadow cursor-default`}
            >
              <Icon size={28} className="mb-2" />
              <span className="text-xs font-bold">{badge.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
