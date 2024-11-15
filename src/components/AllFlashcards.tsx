import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Flashcard } from '../types';

interface Props {
  onEdit: (flashcard: Flashcard) => void;
}

export function AllFlashcards({ onEdit }: Props) {
  const { flashcards, filters, deleteFlashcard } = useStore();

  const filteredCards = flashcards
    .filter((card) => {
      if (filters.difficulty && card.difficulty !== filters.difficulty) {
        return false;
      }
      if (
        filters.topics.length > 0 &&
        !filters.topics.some((topic) => card.topics.includes(topic))
      ) {
        return false;
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          card.title.toLowerCase().includes(query) ||
          card.description.toLowerCase().includes(query) ||
          card.solution.toLowerCase().includes(query) ||
          card.explanation.toLowerCase().includes(query) ||
          card.topics.some((topic) => topic.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'difficulty':
          return filters.sortOrder === 'asc'
            ? a.difficulty - b.difficulty
            : b.difficulty - a.difficulty;
        case 'lastReviewed':
          if (!a.lastReviewed) return 1;
          if (!b.lastReviewed) return -1;
          return filters.sortOrder === 'asc'
            ? a.lastReviewed.getTime() - b.lastReviewed.getTime()
            : b.lastReviewed.getTime() - a.lastReviewed.getTime();
        case 'mastery':
          return filters.sortOrder === 'asc'
            ? a.mastery - b.mastery
            : b.mastery - a.mastery;
        default:
          return 0;
      }
    });

  const formatNextReview = (nextReview: Date | null) => {
    if (!nextReview) return 'Available now';
    const now = new Date();
    const reviewDate = new Date(nextReview);
    if (reviewDate <= now) return 'Available now';
    return format(reviewDate, 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Difficulty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Topics
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Mastery
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Last Reviewed
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Next Review
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {filteredCards.map((card) => (
            <tr key={card.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {card.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {card.description.substring(0, 50)}
                  {card.description.length > 50 ? '...' : ''}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {card.difficulty} kyu
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {card.topics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                      className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-progress"
                      style={{ width: `${card.mastery}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {card.mastery}%
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {card.lastReviewed
                  ? format(new Date(card.lastReviewed), 'MMM d, yyyy h:mm a')
                  : 'Never'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`${
                  !card.nextReview || new Date(card.nextReview) <= new Date() 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {formatNextReview(card.nextReview ? new Date(card.nextReview) : null)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(card)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteFlashcard(card.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}