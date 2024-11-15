import { useState } from 'react';
import { Brain, Grid, List, Plus, X } from 'lucide-react';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { FlashcardList } from './components/FlashcardList';
import { FlashcardEditor } from './components/FlashcardEditor';
import { ReviewMode } from './components/ReviewMode';
import { AllFlashcards } from './components/AllFlashcards';
import { Flashcard } from './types';
import { useStore } from './store/useStore';

export default function App() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | undefined>();
  const { viewMode, setViewMode } = useStore();
  const flashcards = useStore((state) => state.flashcards);

  const [showAllCards, setShowAllCards] = useState(false);
  
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
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-md shadow-sm p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid'
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`p-2 rounded ${
                    viewMode === 'all'
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={() => setShowAllCards(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
              >
                View All
              </button>
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
            {viewMode === 'all' ? (
              <AllFlashcards onEdit={handleEdit} />
            ) : (
              <FlashcardList onEdit={handleEdit} />
            )}
          </div>
        </main>

        {showAllCards && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    All Flashcards
                  </h2>
                  <button
                    onClick={() => setShowAllCards(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <AllFlashcards onEdit={handleEdit} />
              </div>
            </div>
          </div>
        )}

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