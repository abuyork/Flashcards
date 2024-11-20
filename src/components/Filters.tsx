import { useState } from 'react';
import { Search, SortAsc, SortDesc, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { KyuLevel, Topic } from '../types';

const TOPICS: Topic[] = [
  'Algorithms',
  'Data Structures',
  'Mathematics',
  'String Manipulation',
  'Arrays',
  'Regular Expressions',
  'Functional Programming',
  'Object-oriented Programming',
];

export function Filters() {
  const { filters, updateFilters } = useStore();
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);

  const formatDifficulty = (difficulty: KyuLevel | null) => {
    if (!difficulty) return 'All Levels';
    return difficulty === 'Train' ? 'Train' : `${difficulty} kyu`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search flashcards..."
          value={filters.searchQuery}
          onChange={(e) => updateFilters({ searchQuery: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Difficulty Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Difficulty
          </label>
          <button
            onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <span>{formatDifficulty(filters.difficulty)}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isDifficultyOpen ? 'rotate-180' : ''}`} />
          </button>
          {isDifficultyOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => {
                    updateFilters({ difficulty: null });
                    setIsDifficultyOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                >
                  All Levels
                </button>
                {[8, 7, 6, 5, 4, 3, 2, 1].map((kyu) => (
                  <button
                    key={kyu}
                    onClick={() => {
                      updateFilters({ difficulty: kyu as KyuLevel });
                      setIsDifficultyOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                  >
                    {kyu} kyu
                  </button>
                ))}
                <button
                  onClick={() => {
                    updateFilters({ difficulty: 'Train' });
                    setIsDifficultyOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                >
                  Train
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Topics Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Topics
          </label>
          <button
            onClick={() => setIsTopicsOpen(!isTopicsOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <span>
              {filters.topics.length === 0
                ? 'Select Topics'
                : `${filters.topics.length} Selected`}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isTopicsOpen ? 'rotate-180' : ''}`} />
          </button>
          {isTopicsOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
              <div className="py-1">
                {TOPICS.map((topic) => (
                  <label
                    key={topic}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.topics.includes(topic)}
                      onChange={(e) => {
                        const newTopics = e.target.checked
                          ? [...filters.topics, topic]
                          : filters.topics.filter((t) => t !== topic);
                        updateFilters({ topics: newTopics });
                      }}
                      className="mr-2 rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-200">{topic}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort Controls */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <div className="flex space-x-2">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                updateFilters({
                  sortBy: e.target.value as typeof filters.sortBy,
                })
              }
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="difficulty">Difficulty</option>
              <option value="lastReviewed">Last Reviewed</option>
              <option value="mastery">Mastery</option>
            </select>
            <button
              onClick={() =>
                updateFilters({
                  sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
                })
              }
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {filters.sortOrder === 'asc' ? (
                <SortAsc className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <SortDesc className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}