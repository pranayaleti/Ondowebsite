import { memo, useState } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import { formatDateTimeUserTimezone } from '../../utils/dateFormat.js';
import { renderMarkdown } from '../../utils/markdownRenderer.js';

const MessageBubble = memo(({ 
  message, 
  onCopy, 
  copiedMessageId
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTimestamp, setShowTimestamp] = useState(false);

  const formatTime = (timestamp) => {
    return formatDateTimeUserTimezone(timestamp, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatFullTimestamp = (timestamp) => {
    return formatDateTimeUserTimezone(timestamp, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div
      className={`flex gap-3 group ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 relative ${
          isUser
            ? 'bg-orange-600 text-white'
            : isError
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-white text-gray-800 shadow-sm'
        }`}
      >
        {/* Copy button - shown on hover */}
        {isHovered && (
          <button
            onClick={() => onCopy(message.content, message.id)}
            className={`absolute -top-2 -right-2 p-1.5 rounded-full shadow-lg transition-all z-10 ${
              isUser
                ? 'bg-white text-orange-600 hover:bg-gray-100'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="Copy message"
            title="Copy message"
          >
            {copiedMessageId === message.id ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
        <div className="text-sm whitespace-pre-wrap">
          {/* #region agent log */}
          {(() => {
            try {
              // #region agent log
              fetch('http://127.0.0.1:7243/ingest/4ed8e0b4-0b62-40c2-b89e-683e2b0cadf2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MessageBubble.jsx:83',message:'Rendering message content',data:{messageId:message?.id,contentType:typeof message?.content,contentLength:message?.content?.length,hasContent:!!message?.content},timestamp:Date.now(),runId:'run1',hypothesisId:'D'})}).catch(()=>{});
              // #endregion
              return renderMarkdown(message?.content || '');
            } catch (error) {
              // #region agent log
              fetch('http://127.0.0.1:7243/ingest/4ed8e0b4-0b62-40c2-b89e-683e2b0cadf2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MessageBubble.jsx:87',message:'Error rendering markdown',data:{error:error?.message,errorStack:error?.stack,messageId:message?.id},timestamp:Date.now(),runId:'run1',hypothesisId:'E'})}).catch(()=>{});
              // #endregion
              return message?.content || '';
            }
          })()}
          {/* #endregion */}
        </div>
        <p 
          className="text-xs mt-1 opacity-70 cursor-help"
          onMouseEnter={() => setShowTimestamp(true)}
          onMouseLeave={() => setShowTimestamp(false)}
          title={formatFullTimestamp(message.timestamp)}
        >
          {formatTime(message.timestamp)}
        </p>
        {showTimestamp && (
          <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-20">
            {formatFullTimestamp(message.timestamp)}
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
