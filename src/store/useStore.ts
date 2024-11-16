import { create } from 'zustand';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Flashcard, FlashcardFilters } from '../types';
import { addDays } from 'date-fns';

interface State {
  flashcards: Flashcard[];
  filters: FlashcardFilters;
  viewMode: 'grid' | 'list' | 'all';
  loadFlashcards: () => Promise<void>;
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'created' | 'updated'>) => Promise<void>;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  updateFilters: (filters: Partial<FlashcardFilters>) => void;
  setViewMode: (mode: 'grid' | 'list' | 'all') => void;
  reviewFlashcard: (id: string, score: number) => Promise<void>;
  darkMode: boolean;
}

const getNextReviewInterval = (mastery: number, wasCorrect: boolean): number => {
  if (!wasCorrect) return 1;
  if (mastery < 25) return 1;
  if (mastery < 50) return 3;
  if (mastery < 75) return 7;
  if (mastery < 90) return 14;
  return 30;
};

export const useStore = create<State>()((set) => ({
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

  loadFlashcards: async () => {
    try {
      const q = query(collection(db, 'flashcards'), orderBy('created', 'desc'));
      const querySnapshot = await getDocs(q);
      const flashcards = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        created: doc.data().created.toDate(),
        updated: doc.data().updated.toDate(),
        lastReviewed: doc.data().lastReviewed?.toDate() || null,
        nextReview: doc.data().nextReview?.toDate() || null,
      })) as Flashcard[];
      set({ flashcards });
    } catch (error) {
      console.error('Error loading flashcards:', error);
    }
  },

  addFlashcard: async (flashcard) => {
    try {
      const newFlashcard = {
        ...flashcard,
        created: new Date(),
        updated: new Date(),
        mastery: 0,
        lastReviewed: null,
        nextReview: null,
      };
      
      const docRef = await addDoc(collection(db, 'flashcards'), newFlashcard);
      set((state) => ({
        flashcards: [
          { ...newFlashcard, id: docRef.id },
          ...state.flashcards,
        ],
      }));
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  },

  updateFlashcard: async (id, updates) => {
    try {
      const docRef = doc(db, 'flashcards', id);
      const updatedData = { ...updates, updated: new Date() };
      await updateDoc(docRef, updatedData);
      
      set((state) => ({
        flashcards: state.flashcards.map((card) =>
          card.id === id
            ? { ...card, ...updates, updated: new Date() }
            : card
        ),
      }));
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  },

  deleteFlashcard: async (id) => {
    try {
      await deleteDoc(doc(db, 'flashcards', id));
      set((state) => ({
        flashcards: state.flashcards.filter((card) => card.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  },

  reviewFlashcard: async (id, score) => {
    try {
      const card = useStore.getState().flashcards.find(c => c.id === id);
      if (!card) return;

      const wasCorrect = score > 0;
      const newMastery = Math.min(100, Math.max(0, card.mastery + score));
      const interval = getNextReviewInterval(newMastery, wasCorrect);
      const nextReview = addDays(new Date(), interval);
      
      const updates = {
        mastery: newMastery,
        lastReviewed: new Date(),
        nextReview,
        updated: new Date(),
      };

      await updateDoc(doc(db, 'flashcards', id), updates);
      
      set((state) => ({
        flashcards: state.flashcards.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    } catch (error) {
      console.error('Error reviewing flashcard:', error);
    }
  },

  updateFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setViewMode: (mode) =>
    set(() => ({
      viewMode: mode,
    })),
}));