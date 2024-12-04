import { useState, useEffect } from 'react';
import { Brain, Plus } from 'lucide-react';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { FlashcardList } from './components/FlashcardList';
import { FlashcardEditor } from './components/FlashcardEditor';
import { ReviewMode } from './components/ReviewMode';
import { Flashcard, KyuLevel } from './types';
import { useStore } from './store/useStore';

export default function App() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | undefined>();
  const [isSelectingDifficulty, setIsSelectingDifficulty] = useState(false);
  const [selectedReviewDifficulty, setSelectedReviewDifficulty] = useState<KyuLevel | 'all'>('all');
  useStore();
  const flashcards = useStore((state) => state.flashcards);
  const loadFlashcards = useStore((state) => state.loadFlashcards);

  const reviewableCards = flashcards.filter(card => {
    const isReviewable = !card.nextReview || new Date() >= new Date(card.nextReview);
    const matchesDifficulty = selectedReviewDifficulty === 'all' || card.difficulty === selectedReviewDifficulty;
    return isReviewable && matchesDifficulty;
  });

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

  const handleStartReview = () => {
    if (reviewableCards.length > 0) {
      setIsSelectingDifficulty(true);
    }
  };

  const handleConfirmDifficulty = () => {
    const availableCards = flashcards.filter(card => {
      const isReviewable = !card.nextReview || new Date() >= new Date(card.nextReview);
      const matchesDifficulty = selectedReviewDifficulty === 'all' || card.difficulty === selectedReviewDifficulty;
      return isReviewable && matchesDifficulty;
    });

    if (availableCards.length > 0) {
      setIsSelectingDifficulty(false);
      setIsReviewMode(true);
    } else {
      setSelectedReviewDifficulty('all');
      alert('No cards available for selected difficulty. Please choose another level.');
    }
  };

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  useEffect(() => {
    const availableCards = flashcards.filter(card => {
      const isReviewable = !card.nextReview || new Date() >= new Date(card.nextReview);
      const matchesDifficulty = selectedReviewDifficulty === 'all' || card.difficulty === selectedReviewDifficulty;
      return isReviewable && matchesDifficulty;
    });

    if (availableCards.length === 0 && selectedReviewDifficulty !== 'all') {
      setSelectedReviewDifficulty('all');
    }
  }, [selectedReviewDifficulty, flashcards]);

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
                onClick={handleStartReview}
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

        {isSelectingDifficulty && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Select Difficulty Level
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedReviewDifficulty('all')}
                    className={`p-3 rounded-lg border ${
                      selectedReviewDifficulty === 'all'
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                        : 'border-gray-700 hover:border-indigo-500/50'
                    }`}
                  >
                    All Levels ({reviewableCards.length})
                  </button>
                  {[8, 7, 6, 5, 4, 3, 2, 1].map((kyu) => {
                    const cardsForLevel = flashcards.filter(card => {
                      const isReviewable = !card.nextReview || new Date() >= new Date(card.nextReview);
                      return isReviewable && card.difficulty === kyu;
                    });

                    if (cardsForLevel.length === 0) return null;

                    return (
                      <button
                        key={kyu}
                        onClick={() => setSelectedReviewDifficulty(kyu as KyuLevel)}
                        className={`p-3 rounded-lg border ${
                          selectedReviewDifficulty === kyu
                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                            : 'border-gray-700 hover:border-indigo-500/50'
                        }`}
                      >
                        {kyu} kyu ({cardsForLevel.length})
                      </button>
                    );
                  })}
                  {flashcards.some(card => card.difficulty === 'Train') && (
                    <button
                      onClick={() => setSelectedReviewDifficulty('Train')}
                      className={`p-3 rounded-lg border ${
                        selectedReviewDifficulty === 'Train'
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                          : 'border-gray-700 hover:border-indigo-500/50'
                      }`}
                    >
                      Train ({flashcards.filter(card => card.difficulty === 'Train').length})
                    </button>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setIsSelectingDifficulty(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDifficulty}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Start Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditorOpen && (
          <FlashcardEditor flashcard={editingCard} onClose={handleClose} />
        )}

        {isReviewMode && (
          <ReviewMode 
            onClose={() => setIsReviewMode(false)} 
            initialDifficulty={selectedReviewDifficulty}
          />
        )}
      </div>
    </div>
  );
}