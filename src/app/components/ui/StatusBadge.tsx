// components/ui/StatusBadge.tsx
interface StatusBadgeProps {
  type: 'priority' | 'sentiment' | 'category' | 'default';
  value: string;
}

const getBadgeColors = (type: string, value: string) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium border";
  
  switch (type) {
    case 'priority':
      switch (value.toLowerCase()) {
        case 'high': return `${baseClasses} text-red-600 bg-red-50 border-red-200`;
        case 'medium': return `${baseClasses} text-yellow-600 bg-yellow-50 border-yellow-200`;
        case 'low': return `${baseClasses} text-green-600 bg-green-50 border-green-200`;
        default: return `${baseClasses} text-gray-600 bg-gray-50 border-gray-200`;
      }
    case 'sentiment':
      switch (value.toLowerCase()) {
        case 'positive': return `${baseClasses} text-green-600 bg-green-50 border-green-200`;
        case 'negative': return `${baseClasses} text-red-600 bg-red-50 border-red-200`;
        case 'neutral': return `${baseClasses} text-blue-600 bg-blue-50 border-blue-200`;
        default: return `${baseClasses} text-gray-600 bg-gray-50 border-gray-200`;
      }
    case 'category':
      switch (value.toLowerCase()) {
        case 'account_management': return `${baseClasses} text-purple-600 bg-purple-50 border-purple-200`;
        case 'product_inquiry': return `${baseClasses} text-blue-600 bg-blue-50 border-blue-200`;
        case 'support': return `${baseClasses} text-orange-600 bg-orange-50 border-orange-200`;
        default: return `${baseClasses} text-gray-600 bg-gray-50 border-gray-200`;
      }
    default:
      return `${baseClasses} text-gray-600 bg-gray-50 border-gray-200`;
  }
};

export const StatusBadge = ({ type, value }: StatusBadgeProps) => {
  return (
    <span className={getBadgeColors(type, value)}>
      {value}
    </span>
  );
};