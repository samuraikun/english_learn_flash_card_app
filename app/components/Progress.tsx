import { Brain } from 'lucide-react';

interface ProgressProps {
  total: number;
  understood: number;
}

export function Progress({ total, understood }: ProgressProps) {
  const percentage = Math.round((understood / total) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Learning Progress</span>
        </div>
        <span className="text-sm font-medium text-gray-700">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {understood} of {total} words mastered
      </p>
    </div>
  );
}