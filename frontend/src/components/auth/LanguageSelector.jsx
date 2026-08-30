import React, { useState } from 'react';
import Button from '../common/Button';

const AVAILABLE_LANGUAGES = ['JavaScript', 'Python', 'TypeScript', 'Java', 'Go', 'Rust', 'C++', 'Ruby'];
const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced'];

export default function LanguageSelector({ onSubmit }) {
  const [selections, setSelections] = useState([]);
  
  const handleAddLanguage = (lang) => {
    if (!selections.find(s => s.language === lang)) {
      setSelections([...selections, { language: lang, proficiency: 'beginner' }]);
    }
  };

  const handleRemoveLanguage = (lang) => {
    setSelections(selections.filter(s => s.language !== lang));
  };

  const handleProficiencyChange = (lang, prof) => {
    setSelections(selections.map(s => s.language === lang ? { ...s, proficiency: prof } : s));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(selections);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">Select Your Languages</h3>
      
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {AVAILABLE_LANGUAGES.map(lang => (
          <button
            key={lang}
            onClick={() => handleAddLanguage(lang)}
            disabled={selections.find(s => s.language === lang)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              selections.find(s => s.language === lang)
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:border-google-blue hover:text-google-blue'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {selections.map((sel) => (
          <div key={sel.language} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span className="font-medium text-gray-700 w-24">{sel.language}</span>
            <select
              value={sel.proficiency}
              onChange={(e) => handleProficiencyChange(sel.language, e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-google-blue focus:border-google-blue p-2"
            >
              {PROFICIENCY_LEVELS.map(level => (
                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => handleRemoveLanguage(sel.language)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="pt-6">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={selections.length === 0}
          >
            Complete Setup
          </Button>
        </div>
      </form>
    </div>
  );
}
