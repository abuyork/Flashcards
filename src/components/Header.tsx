import { Swords } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Swords className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-400 float-animation" />
              <div className="absolute inset-0 bg-indigo-400/20 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Interview Flashcards
              </h1>
              <p className="text-sm text-gray-400">
                Review and practice coding questions
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}