import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { ChevronLeft, ChevronRight, Code, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Props {
  onClose: () => void;
}

export function ReviewMode({ onClose }: Props) {
  const { flashcards, reviewFlashcard } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [, setHasAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingCards, setRemainingCards] = useState<typeof flashcards>([]);

  const calculateReviewableCards = () => {
    return flashcards.filter(
      (card) => !card.nextReview || new Date() >= new Date(card.nextReview)
    );
  };

  useEffect(() => {
    setRemainingCards(calculateReviewableCards());
  }, [flashcards]);

  const currentCard = remainingCards[currentIndex];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && !showSolution) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, showSolution]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrevious();
      } else if (e.key === 'ArrowRight' && currentIndex < remainingCards.length - 1) {
        handleNext();
      } else if (e.key === ' ' && !showSolution) {
        e.preventDefault();
        setShowSolution(true);
      } else if (showSolution) {
        if (e.key === '1') {
          handleRate(-5); // Still Hard
        } else if (e.key === '2') {
          handleRate(10); // Got It
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, showSolution, remainingCards.length]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('reviewProgress');
    if (savedProgress) {
      const { index, timestamp } = JSON.parse(savedProgress);
      // Only restore if within last hour
      if (Date.now() - timestamp < 3600000) {
        setCurrentIndex(index);
      } else {
        localStorage.removeItem('reviewProgress');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reviewProgress', JSON.stringify({
      index: currentIndex,
      timestamp: Date.now()
    }));
  }, [currentIndex]);

  const handleNext = () => {
    setShowSolution(false);
    setHasAnswered(false);
    setTimeElapsed(0);
    
    if (currentIndex < remainingCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    setShowSolution(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRate = async (score: number) => {
    try {
      setHasAnswered(true);
      await reviewFlashcard(currentCard.id, score);
      
      const updatedCards = calculateReviewableCards();
      setRemainingCards(updatedCards);
      
      if (currentIndex < updatedCards.length - 1) {
        handleNext();
      } else if (updatedCards.length === 0) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to review flashcard:', error);
    }
  };

  if (!currentCard) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              All caught up! 🎉
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You've reviewed all available flashcards. Come back later for more!
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-[98vw] sm:max-w-2xl max-h-[98vh] overflow-y-auto shadow-2xl animate-slideUp">
        <div className="p-3 sm:p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm">
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Card {currentIndex + 1} of {remainingCards.length}
              </span>
              <span className="font-medium text-gray-500 dark:text-gray-400">
                {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {currentCard.title}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {currentCard.difficulty} kyu
                </span>
                <div className="w-20 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className="h-2 bg-indigo-600 rounded-full"
                    style={{ width: `${currentCard.mastery}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                {currentCard.description}
              </p>
            </div>

            {showSolution ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="border rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 flex items-center">
                    <Code className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Solution
                    </span>
                  </div>
                  <div className="h-36 sm:h-48 md:h-64">
                    {isLoading && (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                      </div>
                    )}
                    <Editor
                      value={currentCard.solution}
                      language="javascript"
                      theme="vs-dark"
                      loading={<div className="animate-pulse h-full bg-gray-800" />}
                      beforeMount={() => setIsLoading(true)}
                      onMount={() => setIsLoading(false)}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: window.innerWidth < 640 ? 12 : 14,
                        lineNumbers: window.innerWidth >= 640 ? 'on' : 'off',
                      }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                    Explanation
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {currentCard.explanation}
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleRate(-5)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Still Hard
                  </button>
                  <button
                    onClick={() => handleRate(10)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Got It!
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center py-8">
                <button
                  onClick={() => setShowSolution(true)}
                  className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="relative z-10">Show Solution</span>
                  <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              aria-label="Previous flashcard"
              className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === remainingCards.length - 1}
              className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}