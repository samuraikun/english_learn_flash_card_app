import { useState, useEffect } from 'react';
import type { FlashCard } from '~/types';
import { Volume2, Check, X } from 'lucide-react';

interface FlashCardProps {
  card: FlashCard;
  onNext: () => void;
  onPrevious: () => void;
  onStatusChange: (status: 'understood' | 'learning') => void;
  total: number;
  current: number;
}

export function FlashCardComponent({ 
  card, 
  onNext, 
  onPrevious, 
  onStatusChange,
  total, 
  current 
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [current]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const handleStatusChange = (e: React.MouseEvent, status: 'understood' | 'learning') => {
    e.stopPropagation();
    onStatusChange(status);
    setIsFlipped(false);
    onNext();
  };

  const highlightWord = (text: string, word: string) => {
    const regex = new RegExp(`(${word})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? <strong key={i} className="text-blue-600">{part}</strong> : part
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onPrevious}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={current === 0}
        >
          Previous
        </button>
        <span className="text-gray-600">
          {current + 1} / {total}
        </span>
        <button
          onClick={onNext}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={current === total - 1}
        >
          Next
        </button>
      </div>

      <div
        className={`relative w-full h-96 cursor-pointer perspective-1000 transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-8 backface-hidden">
          <div className="flex justify-between items-start">
            <h2 className="text-4xl font-bold text-gray-800">{card.word}</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak(card.word);
              }}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
          <p className="text-xl text-gray-600 mt-2">{card.phonetic}</p>
          <p className="text-gray-700 mt-6 italic">
            {highlightWord(card.example, card.word)}
          </p>
        </div>

        <div className="absolute w-full h-full bg-blue-50 rounded-xl shadow-lg p-8 backface-hidden rotate-y-180">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-600">English Definition</h3>
              <p className="text-xl text-gray-800">{card.definition}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">Japanese Translation</h3>
              <p className="text-xl text-gray-800">{card.meaning}</p>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={(e) => handleStatusChange(e, 'learning')}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <X className="w-5 h-5" />
              Still Learning
            </button>
            <button
              onClick={(e) => handleStatusChange(e, 'understood')}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Check className="w-5 h-5" />
              Got It!
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-4">Click the card to flip</p>
    </div>
  );
}