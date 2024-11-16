import { Edit, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Flashcard } from '../types';

interface Props {
  onEdit: (flashcard: Flashcard) => void;
}

export function FlashcardList({ onEdit }: Props) {
  const flashcards = useStore((state) => state.flashcards.filter((card) => {
    const filters = state.filters;
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
        card.topics.some((topic) => topic.toLowerCase().includes(query))
      );
    }
    return true;
  }));
  
  const deleteFlashcard = useStore((state) => state.deleteFlashcard);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm">
            <th className="py-3 px-4">TITLE</th>
            <th className="py-3 px-4">DIFFICULTY</th>
            <th className="py-3 px-4">TOPICS</th>
            <th className="py-3 px-4">MASTERY</th>
            <th className="py-3 px-4">LAST REVIEWED</th>
            <th className="py-3 px-4">NEXT REVIEW</th>
            <th className="py-3 px-4">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {flashcards.map((flashcard: Flashcard) => (
            <tr 
              key={flashcard.id}
              className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-4 px-4">
                <div>
                  <div className="text-white">{flashcard.title}</div>
                  <div className="text-gray-400 text-sm">{flashcard.description}</div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {flashcard.difficulty} kyu
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-wrap gap-1">
                  {flashcard.topics?.map((topic: string) => (
                    <span
                      key={topic}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${flashcard.mastery || 0}%` }}
                  />
                </div>
              </td>
              <td className="py-4 px-4 text-gray-400">
                {flashcard.lastReviewed ? new Date(flashcard.lastReviewed).toLocaleDateString() : 'Never'}
              </td>
              <td className="py-4 px-4 text-gray-400">
                {flashcard.nextReview ? new Date(flashcard.nextReview).toLocaleDateString() : 'Available'}
              </td>
              <td className="py-4 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(flashcard)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteFlashcard(flashcard.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
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