import { memo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send } from 'lucide-react';

const ChatInput = memo(forwardRef(({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage, 
  isLoading,
  placeholder = "Type a message... (Shift+Enter for new line)"
}, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
  }));

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [inputMessage]);

  const handleChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    // Enter to send, Shift+Enter for newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(e);
    }
  };

  return (
    <div className="flex gap-2">
      <textarea
        ref={inputRef}
        value={inputMessage}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none min-h-[40px] max-h-[120px]"
        disabled={isLoading}
        rows={1}
        aria-label="Message input"
        aria-describedby="input-help-text"
      />
      <button
        type="submit"
        disabled={!inputMessage.trim() || isLoading}
        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        aria-label="Send message"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}));

ChatInput.displayName = 'ChatInput';

export default ChatInput;
