import { memo } from 'react';

const QuickReplies = memo(({ quickReplies, onQuickReply }) => {
  if (!quickReplies || quickReplies.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      {quickReplies.map((reply, idx) => (
        <button
          key={idx}
          onClick={() => onQuickReply(reply.value)}
          className="block w-full text-left px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
          aria-label={`Quick reply: ${reply.label}`}
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
});

QuickReplies.displayName = 'QuickReplies';

export default QuickReplies;
