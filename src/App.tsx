import { useState, useEffect } from 'react';
import { Brain, Plus } from 'lucide-react';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { FlashcardList } from './components/FlashcardList';
import { FlashcardEditor } from './components/FlashcardEditor';
import { ReviewMode } from './components/ReviewMode';
import { Flashcard } from './types';
import { useStore } from './store/useStore';

export default function App() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | undefined>();
  useStore();
  const flashcards = useStore((state) => state.flashcards);
  const loadFlashcards = useStore((state) => state.loadFlashcards);

  const reviewableCards = flashcards.filter(
    (card) => !card.nextReview || new Date() >= new Date(card.nextReview)
  );

  const getNextReviewTime = () => {
    const nextReviewDates = flashcards
      .map(card => card.nextReview)
      .filter(date => date && new Date(date) > new Date())
      .sort((a, b) => new Date(a!).getTime() - new Date(b!).getTime());
    
    return nextReviewDates[0];
  };

  const handleEdit = (flashcard: Flashcard) => {
    setEditingCard(flashcard);
    setIsEditorOpen(true);
  };

  const handleClose = () => {
    setEditingCard(undefined);
    setIsEditorOpen(false);
  };

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  return (
    <div className="dark">
      <div className="min-h-screen bg-gray-900">
        <Header />
        
        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                My Flashcards
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {flashcards.length} cards total • {reviewableCards.length} ready for review
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsReviewMode(true)}
                disabled={reviewableCards.length === 0}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  reviewableCards.length === 0
                    ? `Next review available ${getNextReviewTime() ? `at ${new Date(getNextReviewTime()!).toLocaleString()}` : 'when you add cards'}`
                    : 'Start reviewing cards'
                }
              >
                <Brain className="h-5 w-5 mr-2" />
                Review ({reviewableCards.length})
              </button>
              <button
                onClick={() => setIsEditorOpen(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                New
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <Filters />
            <FlashcardList onEdit={handleEdit} />
          </div>
        </main>

        {isEditorOpen && (
          <FlashcardEditor flashcard={editingCard} onClose={handleClose} />
        )}

        {isReviewMode && (
          <ReviewMode onClose={() => setIsReviewMode(false)} />
        )}
      </div>
    </div>
  );
}