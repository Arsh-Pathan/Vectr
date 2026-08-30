import React from 'react';
import Card from '../common/Card';
import { Lightbulb, FileCode, BookOpen, Clock } from 'lucide-react';

export default function GuidancePanel({ guidance }) {
  if (!guidance) return null;

  return (
    <Card className="flex flex-col h-full bg-gradient-to-br from-white to-blue-50/30" hover={false}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-google-yellow/20 flex items-center justify-center text-google-yellow">
          <Lightbulb size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">AI Guidance</h2>
      </div>

      <div className="space-y-6 overflow-y-auto pr-2">
        
        {/* Suggested Approach */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-blue-100 text-google-blue flex items-center justify-center text-xs">1</span>
            Suggested Approach
          </h3>
          <ol className="list-decimal list-outside ml-6 space-y-2 text-sm text-gray-700">
            {guidance.suggested_approach?.map((step, idx) => (
              <li key={idx} className="pl-1">{step}</li>
            ))}
          </ol>
        </div>

        {/* Relevant Files */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileCode size={16} className="text-google-green" /> Relevant Files
          </h3>
          <ul className="space-y-1">
            {guidance.relevant_files?.map(file => (
              <li key={file} className="text-sm text-gray-600 bg-white border border-gray-100 px-3 py-1.5 rounded-md flex items-center gap-2">
                <span className="w-1 h-1 bg-google-green rounded-full"></span>
                <span className="font-mono text-xs">{file}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Concepts to Review */}
        {guidance.concepts_to_review && guidance.concepts_to_review.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-google-red" /> Concepts to Review
            </h3>
            <div className="flex flex-wrap gap-2">
              {guidance.concepts_to_review.map(concept => (
                <span key={concept} className="px-2.5 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Estimated Time */}
        <div className="pt-4 border-t border-blue-100 flex items-center gap-2 text-sm font-medium text-gray-500">
          <Clock size={16} /> Estimated time: {guidance.estimated_time || 'Unknown'}
        </div>

      </div>
    </Card>
  );
}
