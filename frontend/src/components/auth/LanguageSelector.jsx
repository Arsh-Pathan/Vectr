import React, { useState } from 'react';
import Button from '../common/Button';

const POPULAR_LANGUAGES = ['JavaScript', 'Python', 'TypeScript', 'Java', 'Go', 'Rust', 'C++', 'Ruby'];
const ALL_LANGUAGES = [
  'JavaScript', 'Python', 'TypeScript', 'Java', 'Go', 'Rust', 'C++', 'C', 'C#',
  'Ruby', 'Swift', 'Kotlin', 'PHP', 'HTML', 'CSS', 'Dart', 'Shell', 'Bash',
  'SQL', 'R', 'Objective-C', 'Scala', 'Elixir', 'Haskell', 'Lua', 'Perl',
  'Assembly', 'Vue', 'React', 'Angular', 'Svelte', 'Solidity', 'GraphQL'
];
const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced'];

export default function LanguageSelector({ onSubmit }) {
  const [selections, setSelections] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  
  const handleAddLanguage = (lang) => {
    if (lang && !selections.find(s => s.language.toLowerCase() === lang.toLowerCase())) {
      setSelections([...selections, { language: lang, proficiency: 'beginner' }]);
    }
    setSearchInput('');
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

  const handleSearchAdd = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      handleAddLanguage(searchInput.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">Select Your Languages</h3>
      
      <div className="mb-4">
        <form onSubmit={handleSearchAdd} className="flex gap-2">
          <input
            type="text"
            list="language-list"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search or add custom language..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-google-blue outline-none"
          />
          <datalist id="language-list">
            {ALL_LANGUAGES.map(lang => (
              <option key={lang} value={lang} />
            ))}
          </datalist>
          <Button type="submit" variant="secondary" className="px-4">Add</Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {POPULAR_LANGUAGES.map(lang => (
          <button
            key={lang}
            onClick={() => handleAddLanguage(lang)}
            disabled={selections.find(s => s.language.toLowerCase() === lang.toLowerCase())}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              selections.find(s => s.language.toLowerCase() === lang.toLowerCase())
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
            <span className="font-medium text-gray-700 w-24 truncate" title={sel.language}>{sel.language}</span>
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
