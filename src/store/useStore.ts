import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Flashcard, FlashcardFilters } from '../types';
import { addDays } from 'date-fns';

interface State {
  flashcards: Flashcard[];
  filters: FlashcardFilters;
  viewMode: 'grid' | 'list' | 'all';
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'created' | 'updated'>) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  updateFilters: (filters: Partial<FlashcardFilters>) => void;
  setViewMode: (mode: 'grid' | 'list' | 'all') => void;
  reviewFlashcard: (id: string, score: number) => void;
  darkMode: boolean;
}

// Spaced repetition intervals (in days) based on mastery level
const getNextReviewInterval = (mastery: number, wasCorrect: boolean): number => {
  if (!wasCorrect) return 1; // Review tomorrow if incorrect
  
  if (mastery < 25) return 1;      // 1 day if mastery < 25%
  if (mastery < 50) return 3;      // 3 days if mastery 25-49%
  if (mastery < 75) return 7;      // 7 days if mastery 50-74%
  if (mastery < 90) return 14;     // 14 days if mastery 75-89%
  return 30;                       // 30 days if mastery >= 90%
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      flashcards: [],
      filters: {
        difficulty: null,
        topics: [],
        searchQuery: '',
        sortBy: 'difficulty',
        sortOrder: 'desc',
      },
      viewMode: 'grid',
      darkMode: false,

      addFlashcard: (flashcard) =>
        set((state) => ({
          flashcards: [
            ...state.flashcards,
            {
              ...flashcard,
              id: crypto.randomUUID(),
              created: new Date(),
              updated: new Date(),
              mastery: 0,
              lastReviewed: null,
              nextReview: null,
            },
          ],
        })),

      updateFlashcard: (id, updates) =>
        set((state) => ({
          flashcards: state.flashcards.map((card) =>
            card.id === id
              ? { ...card, ...updates, updated: new Date() }
              : card
          ),
        })),

      deleteFlashcard: (id) =>
        set((state) => ({
          flashcards: state.flashcards.filter((card) => card.id !== id),
        })),

      updateFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      setViewMode: (mode) =>
        set(() => ({
          viewMode: mode,
        })),

      reviewFlashcard: (id, score) =>
        set((state) => ({
          flashcards: state.flashcards.map((card) => {
            if (card.id !== id) return card;
            
            const wasCorrect = score > 0;
            const newMastery = Math.min(100, Math.max(0, card.mastery + score));
            const interval = getNextReviewInterval(newMastery, wasCorrect);
            const nextReview = addDays(new Date(), interval);
            
            return {
              ...card,
              mastery: newMastery,
              lastReviewed: new Date(),
              nextReview: nextReview,
              updated: new Date(),
            };
          }),
        })),
    }),
    {
      name: 'codewars-flashcards',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        flashcards: state.flashcards.map(card => ({
          ...card,
          lastReviewed: card.lastReviewed ? new Date(card.lastReviewed).toISOString() : null,
          nextReview: card.nextReview ? new Date(card.nextReview).toISOString() : null,
          created: new Date(card.created).toISOString(),
          updated: new Date(card.updated).toISOString(),
        })),
      }),
    }
  )
);