import { memo } from 'react';
import { Bot } from 'lucide-react';

const EmptyState = memo(({ aiName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <Bot className="w-12 h-12 text-gray-300 mb-4" />
      <p className="text-gray-500 text-sm">Start a conversation with {aiName}</p>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
