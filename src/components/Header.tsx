const CodeLogo = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-400 float-animation"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Stylized brackets with dots representing code/data */}
    <path d="M8 3L4 12l4 9" />
    <path d="M16 3l4 9-4 9" />
    {/* Connection dots */}
    <circle cx="12" cy="7" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
    {/* Data flow lines */}
    <path d="M12 7l-2 5 2 5" strokeDasharray="2 2" />
    <path d="M12 7l2 5-2 5" strokeDasharray="2 2" />
  </svg>
);

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <CodeLogo />
              <div className="absolute inset-0 bg-indigo-400/20 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Interactive Flashcards
              </h1>
              <p className="text-sm text-gray-400">
                Review and practice every day with flashcards
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}