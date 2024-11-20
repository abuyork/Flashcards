export type KyuLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "Train";

export type Topic =
  | 'Algorithms'
  | 'Data Structures'
  | 'Mathematics'
  | 'String Manipulation'
  | 'Arrays'
  | 'Regular Expressions'
  | 'Functional Programming'
  | 'Object-oriented Programming';

export type Difficulty = 
  | "8 kyu"
  | "7 kyu"
  | "6 kyu"
  | "5 kyu"
  | "4 kyu"
  | "3 kyu"
  | "2 kyu"
  | "1 kyu"
  | "Train";

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
  isExplanationExpanded?: boolean;
}

export interface FlashcardFilters {
  difficulty: KyuLevel | null;
  topics: Topic[];
  searchQuery: string;
  sortBy: 'difficulty' | 'lastReviewed' | 'mastery';
  sortOrder: 'asc' | 'desc';
}