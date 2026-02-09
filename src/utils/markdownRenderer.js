import React from 'react';

/**
 * Simple markdown renderer for chat messages
 * Handles basic markdown: bold, italic, links, lists, code
 */

export const renderMarkdown = (text) => {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/4ed8e0b4-0b62-40c2-b89e-683e2b0cadf2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'markdownRenderer.js:8',message:'renderMarkdown called',data:{textType:typeof text,textLength:text?.length,textValue:text?.substring(0,50)},timestamp:Date.now(),runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  if (!text) return '';

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/4ed8e0b4-0b62-40c2-b89e-683e2b0cadf2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'markdownRenderer.js:11',message:'Processing text',data:{textLength:text.length},timestamp:Date.now(),runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  // Split by lines to handle line breaks
  const lines = text.split('\n');
  const elements = [];

  lines.forEach((line, index) => {
    if (line.trim() === '') {
      elements.push(<br key={`br-${index}`} />);
      return;
    }

    // Process inline markdown
    const processed = processInlineMarkdown(line);
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4ed8e0b4-0b62-40c2-b89e-683e2b0cadf2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'markdownRenderer.js:25',message:'Processed line',data:{lineIndex:index,processedType:Array.isArray(processed)?'array':typeof processed,processedLength:Array.isArray(processed)?processed.length:null},timestamp:Date.now(),runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    elements.push(
      <span key={`line-${index}`}>
        {processed}
        {index < lines.length - 1 && <br />}
      </span>
    );
  });

  return elements;
};

/**
 * Process inline markdown: bold, italic, links, code
 */
const processInlineMarkdown = (text) => {
  const parts = [];

  // URL pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  
  // Process URLs first
  let match;
  const urlMatches = [];
  while ((match = urlPattern.exec(text)) !== null) {
    urlMatches.push({
      start: match.index,
      end: match.index + match[0].length,
      url: match[0],
    });
  }

  // Process text with markdown
  let currentIndex = 0;
  const allMatches = [
    ...urlMatches.map(m => ({ ...m, type: 'url' })),
    // Bold: **text**
    ...getMatches(text, /\*\*(.*?)\*\*/g, 'bold'),
    // Italic: *text* or _text_
    ...getMatches(text, /(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, 'italic'),
    // Code: `code`
    ...getMatches(text, /`([^`]+)`/g, 'code'),
  ].sort((a, b) => a.start - b.start);

  // Remove overlapping matches, prefer URLs
  let filteredMatches = [];
  for (const match of allMatches) {
    const overlaps = filteredMatches.some(
      m => !(match.end <= m.start || match.start >= m.end)
    );
    if (!overlaps || match.type === 'url') {
      if (match.type === 'url') {
        // Remove any overlapping non-URL matches
        filteredMatches = filteredMatches.filter(
          m => m.type === 'url' || (match.end <= m.start || match.start >= m.end)
        );
      }
      filteredMatches.push(match);
    }
  }

  filteredMatches.sort((a, b) => a.start - b.start);

  filteredMatches.forEach((match) => {
    // Add text before match
    if (match.start > currentIndex) {
      const beforeText = text.substring(currentIndex, match.start);
      if (beforeText) {
        parts.push(beforeText);
      }
    }

    // Add match content
    if (match.type === 'url') {
      parts.push(
        <a
          key={`link-${match.start}`}
          href={match.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-600 hover:text-orange-700 underline font-medium break-all"
        >
          {match.url}
        </a>
      );
    } else if (match.type === 'bold') {
      parts.push(
        <strong key={`bold-${match.start}`} className="font-semibold">
          {match.content}
        </strong>
      );
    } else if (match.type === 'italic') {
      parts.push(
        <em key={`italic-${match.start}`} className="italic">
          {match.content}
        </em>
      );
    } else if (match.type === 'code') {
      parts.push(
        <code key={`code-${match.start}`} className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
          {match.content}
        </code>
      );
    }

    currentIndex = match.end;
  });

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/4ed8e0b4-0b62-40c2-b89e-683e2b0cadf2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'markdownRenderer.js:135',message:'processInlineMarkdown returning',data:{partsLength:parts.length,returnType:parts.length>0?'array':'string',textLength:text.length},timestamp:Date.now(),runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  // Always return an array for consistency - React can render arrays
  return parts.length > 0 ? parts : [text];
};

const getMatches = (text, regex, type) => {
  const matches = [];
  let match;
  const regexCopy = new RegExp(regex.source, regex.flags);
  
  while ((match = regexCopy.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      content: match[1] || match[0],
      type,
    });
  }
  
  return matches;
};
