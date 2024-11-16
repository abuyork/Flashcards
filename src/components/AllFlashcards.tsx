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


  return (
    <div className="space-y-4">
      {filteredCards.map((card) => (
        <div
          key={card.id}
          className="bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white mb-2">
                {card.title}
              </h3>
              <p className="text-gray-400">{card.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {card.topics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                  >
                    {topic}
                  </span>
                ))}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  Level {card.difficulty}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(card)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => deleteFlashcard(card.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}