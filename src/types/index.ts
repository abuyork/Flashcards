export type KyuLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Topic =
  | 'Algorithms'
  | 'Data Structures'
  | 'Mathematics'
  | 'String Manipulation'
  | 'Arrays'
  | 'Regular Expressions'
  | 'Functional Programming'
  | 'Object-oriented Programming';

export interface Flashcard {
  id: string;
  title: string;
  description: string;
  difficulty: KyuLevel;
  topics: Topic[];
  solution: string;
  explanation: string;
  testCases: string;
  lastReviewed: Date | null;
  nextReview: Date | null;
  mastery: number; // 0-100
  created: Date;
  updated: Date;
}

export interface FlashcardFilters {
  difficulty: KyuLevel | null;
  topics: Topic[];
  searchQuery: string;
  sortBy: 'difficulty' | 'lastReviewed' | 'mastery';
  sortOrder: 'asc' | 'desc';
}