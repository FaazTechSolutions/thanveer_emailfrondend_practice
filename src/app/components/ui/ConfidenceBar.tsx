// components/ui/ConfidenceBar.tsx
interface ConfidenceBarProps {
  confidence: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.9) return "bg-green-500";
  if (confidence >= 0.7) return "bg-yellow-500";
  return "bg-red-500";
};

export const ConfidenceBar = ({ confidence, showLabel = true, size = 'md' }: ConfidenceBarProps) => {
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`bg-gray-200 rounded-full flex-1 ${heightClasses[size]}`}>
        <div
          className={`rounded-full ${getConfidenceColor(confidence)} ${heightClasses[size]}`}
          style={{ width: `${confidence * 100}%` }}
        ></div>
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 font-medium min-w-[40px]">
          {Math.round(confidence * 100)}%
        </span>
      )}
    </div>
  );
};