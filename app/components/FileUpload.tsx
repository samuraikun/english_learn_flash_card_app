import { useRef, useState } from "react";
import { Upload, Loader2, HelpCircle } from "lucide-react";
import type { FlashCard, CSVRow } from "~/types";
import { saveFlashCards } from "~/db";

interface FileUploadProps {
  onFileUpload: (cards: FlashCard[]) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const parseCSV = (text: string): FlashCard[] => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values: string[] = [];
        let currentValue = "";
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === "," && !insideQuotes) {
            values.push(currentValue.trim());
            currentValue = "";
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim());

        const cleanValues = values.map((v) => v.replace(/^"|"$/g, "").trim());

        const row = headers.reduce((obj, header, index) => {
          obj[header] = cleanValues[index] || "";
          return obj;
        }, {} as CSVRow);

        return {
          word: row["Word"],
          meaning: row["Meaning (JP)"],
          phonetic: row["Phonetic Symbol"],
          definition: row["English Definition"],
          example: row["Example Sentence"],
          status: "learning" as const,
        };
      });
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const cards = parseCSV(text);

      await saveFlashCards(cards);
      onFileUpload(cards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div
        className={`flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg transition-all duration-200 ${
          isDragging ? "border-2 border-dashed border-blue-400 bg-blue-50" : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          className="hidden"
          disabled={isLoading}
        />
        {isLoading ? (
          <Loader2 className="w-12 h-12 text-blue-600 mb-4 animate-spin" />
        ) : (
          <Upload className="w-12 h-12 text-blue-600 mb-4" />
        )}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Upload CSV File
        </h2>
        <p className="text-gray-600 mb-2 text-center">
          Your CSV should have columns for Word, Meaning (JP), Phonetic Symbol,
          English Definition, and Example Sentence
        </p>
        <button
          onClick={() => setShowExample(!showExample)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm">See CSV structure example</span>
        </button>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`px-6 py-3 bg-blue-600 text-white rounded-lg transition-colors ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Choose File"}
        </button>
      </div>

      {showExample && (
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            CSV File Structure Example
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-700">
                    Word
                  </th>
                  <th className="border border-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-700">
                    Meaning (JP)
                  </th>
                  <th className="border border-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-700">
                    Phonetic Symbol
                  </th>
                  <th className="border border-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-700">
                    English Definition
                  </th>
                  <th className="border border-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-700">
                    Example Sentence
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                    ephemeral
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                    はかない
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                    /ɪˈfem(ə)rəl/
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                    lasting for a very short time
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                    "The ephemeral beauty of cherry blossoms makes them
                    special."
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                    serendipity
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                    幸運な偶然
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                    /ˌserənˈdɪpəti/
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                    finding good things without looking for them
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                    "Meeting my best friend was pure serendipity, as we both
                    love the same, rare books."
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Note:</span> Save your spreadsheet
              as a CSV file with these exact column headers.
            </p>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Tips:</span>
              <ul className="list-disc ml-5 mt-1">
                <li>Use quotes (") around text fields that contain commas</li>
                <li>
                  Include all required columns in the exact order shown above
                </li>
                <li>
                  Make sure each field is properly quoted if it contains special
                  characters
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
