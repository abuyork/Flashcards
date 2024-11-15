import { Moon, Sun, Swords } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Header() {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Swords className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 dark:text-indigo-400 float-animation" />
              <div className="absolute inset-0 bg-indigo-600/20 dark:bg-indigo-400/20 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Codewars Flashcards
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Master your coding skills
              </p>
            </div>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:rotate-12"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}