import { Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Flashcard, Topic, KyuLevel } from '../types';
import { useState } from 'react';

// Color mappings for kyu levels
const kyuColors: Record<KyuLevel, { bg: string; text: string }> = {
  1: { bg: 'bg-red-900', text: 'text-red-200' },
  2: { bg: 'bg-orange-900', text: 'text-orange-200' },
  3: { bg: 'bg-yellow-900', text: 'text-yellow-200' },
  4: { bg: 'bg-green-900', text: 'text-green-200' },
  5: { bg: 'bg-teal-900', text: 'text-teal-200' },
  6: { bg: 'bg-blue-900', text: 'text-blue-200' },
  7: { bg: 'bg-indigo-900', text: 'text-indigo-200' },
  8: { bg: 'bg-purple-900', text: 'text-purple-200' },
};

// Color mappings for topics
const topicColors: Record<Topic, { bg: string; text: string }> = {
  'Algorithms': { bg: 'bg-pink-900', text: 'text-pink-200' },
  'Data Structures': { bg: 'bg-purple-900', text: 'text-purple-200' },
  'Mathematics': { bg: 'bg-blue-900', text: 'text-blue-200' },
  'String Manipulation': { bg: 'bg-green-900', text: 'text-green-200' },
  'Arrays': { bg: 'bg-yellow-900', text: 'text-yellow-200' },
  'Regular Expressions': { bg: 'bg-red-900', text: 'text-red-200' },
  'Functional Programming': { bg: 'bg-indigo-900', text: 'text-indigo-200' },
  'Object-oriented Programming': { bg: 'bg-teal-900', text: 'text-teal-200' },
};

interface Props {
  onEdit: (flashcard: Flashcard) => void;
}

export function FlashcardList({ onEdit }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
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

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
                  <div className="text-gray-400 text-sm">
                    <div className={expandedRows.has(flashcard.id) ? '' : 'line-clamp-1'}>
                      {flashcard.description}
                    </div>
                    {flashcard.description.length > 50 && (
                      <button
                        onClick={() => toggleExpand(flashcard.id)}
                        className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center mt-1"
                      >
                        {expandedRows.has(flashcard.id) ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Show more
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${kyuColors[flashcard.difficulty].bg} ${kyuColors[flashcard.difficulty].text}`}>
                  {flashcard.difficulty} kyu
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-wrap gap-1">
                  {flashcard.topics?.map((topic: Topic) => (
                    <span
                      key={topic}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${topicColors[topic].bg} ${topicColors[topic].text}`}
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

export function FlashcardCard({ flashcard }: { flashcard: Flashcard; onEdit: (card: Flashcard) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-white">{flashcard.title}</h3>
        {/* ... other header content ... */}
      </div>
      
      {/* Show truncated explanation by default */}
      <div className="text-gray-300">
        <p className={`${isExpanded ? '' : 'line-clamp-2'}`}>
          {flashcard.explanation}
        </p>
        
        {/* Only show expand button if explanation is long enough */}
        {flashcard.explanation.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center mt-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show more
              </>
            )}
          </button>
        )}
      </div>
      
      {/* ... rest of the card content ... */}
    </div>
  );
}