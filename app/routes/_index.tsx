import type { MetaFunction } from "@remix-run/node";
import { GraduationCap } from "lucide-react";
import { FileUpload } from "~/components/FileUpload";
import { useState, useEffect } from "react";
import type { FlashCard } from "~/types";
import { FlashCardComponent } from "~/components/FlashCard";
import { Progress } from "~/components/Progress";
import { Shuffle, RotateCcw } from "lucide-react";
import { getFlashCards } from "~/db";

export const meta: MetaFunction = () => {
  return [
    { title: "English Flash Cards" },
    { name: "description", content: "Learn English with flash cards" },
  ];
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Index() {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      const savedCards = await getFlashCards();
      if (savedCards.length > 0) {
        setCards(shuffleArray(savedCards));
      }
      setIsLoading(false);
    };
    loadCards();
  }, []);

  const handleFileUpload = (newCards: FlashCard[]) => {
    setCards(
      shuffleArray(newCards.map((card) => ({ ...card, status: "learning" })))
    );
    setCurrentIndex(0);
  };

  const handleCardStatus = (status: "understood" | "learning") => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[currentIndex] = { ...newCards[currentIndex], status };
      return newCards;
    });
  };

  const handleReshuffle = () => {
    setCards((prevCards) => shuffleArray([...prevCards]));
    setCurrentIndex(0);
  };

  const handleReset = () => {
    setCards([]);
    setCurrentIndex(0);
  };

  const understoodCount = cards.filter(
    (card) => card.status === "understood"
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-blue-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            English Flash Cards
          </h1>
        </div>
        <p className="text-gray-600">Upload your CSV and start learning!</p>
      </header>

      <main className="container mx-auto max-w-4xl">
        {cards.length === 0 ? (
          <FileUpload onFileUpload={handleFileUpload} />
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Upload New CSV
              </button>
              <button
                onClick={handleReshuffle}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                Shuffle Cards
              </button>
            </div>
            <Progress total={cards.length} understood={understoodCount} />
            <FlashCardComponent
              card={cards[currentIndex]}
              onNext={() =>
                setCurrentIndex((i) => Math.min(i + 1, cards.length - 1))
              }
              onPrevious={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
              onStatusChange={handleCardStatus}
              total={cards.length}
              current={currentIndex}
            />
          </>
        )}
      </main>
    </div>
  );
}
