import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';

export default function ContributionList({ contributions = [] }) {
  if (!contributions.length) {
    return (
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Contribution History</h3>
        <div className="text-center py-8 text-gray-400">
          <CheckCircle size={40} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">No contributions yet. Solve your first issue to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Contribution History</h3>
      <div className="space-y-3">
        {contributions.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{c.issue_title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.repo_full_name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(c.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
              <span className="text-sm font-bold text-google-blue">+{c.points_earned} pts</span>
              {c.pr_url && (
                <a
                  href={c.pr_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
                >
                  PR <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
