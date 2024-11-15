import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Flashcard } from '../types';

interface Props {
  onEdit: (flashcard: Flashcard) => void;
}

export function FlashcardList({ onEdit }: Props) {
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
          card.solution.toLowerCase().includes(query)
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {filteredCards.map((card) => (
        <div
          key={card.id}
          className="flashcard-grid-item group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          <div className="p-5">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {card.title}
              </h3>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(card)}
                  className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteFlashcard(card.id)}
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {card.difficulty} kyu
              </span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-progress"
                  style={{ width: `${card.mastery}%` }}
                />
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {card.description}
            </p>

            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {card.topics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {card.lastReviewed && (
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Last reviewed: {format(card.lastReviewed, "MMM d, yyyy 'at' h:mm a")}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}