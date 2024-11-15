import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Code, Save, X } from 'lucide-react';
import { Flashcard, KyuLevel, Topic } from '../types';
import { useStore } from '../store/useStore';

interface Props {
  flashcard?: Flashcard;
  onClose: () => void;
}

const INITIAL_STATE: Omit<Flashcard, 'id' | 'created' | 'updated'> = {
  title: '',
  description: '',
  difficulty: 8 as KyuLevel,
  topics: ['Algorithms'],
  solution: '',
  explanation: '',
  testCases: '',
  lastReviewed: null,
  nextReview: null,
  mastery: 0,
};

const TOPICS: Topic[] = [
  'Algorithms',
  'Data Structures',
  'Mathematics',
  'String Manipulation',
  'Arrays',
  'Regular Expressions',
  'Functional Programming',
  'Object-oriented Programming',
];

export function FlashcardEditor({ flashcard, onClose }: Props) {
  const [formData, setFormData] = useState(flashcard || INITIAL_STATE);
  const { addFlashcard, updateFlashcard } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flashcard) {
      updateFlashcard(flashcard.id, formData);
    } else {
      addFlashcard(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-[95vw] sm:max-w-4xl max-h-[95vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {flashcard ? 'Edit Flashcard' : 'New Flashcard'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: Number(e.target.value) as KyuLevel,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    {[8, 7, 6, 5, 4, 3, 2, 1].map((kyu) => (
                      <option key={kyu} value={kyu}>
                        {kyu} kyu
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Topic
                  </label>
                  <select
                    value={formData.topics[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        topics: [e.target.value] as Topic[],
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    {TOPICS.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Solution
                </label>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 flex items-center">
                    <Code className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      JavaScript
                    </span>
                  </div>
                  <div className="h-[calc(100vh-500px)] min-h-[200px]">
                    <Editor
                      value={formData.solution}
                      onChange={(value) => setFormData({ ...formData, solution: value || '' })}
                      language="javascript"
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Explanation
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white h-[calc(100vh-400px)] min-h-[200px]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}