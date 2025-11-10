import { useState } from 'react';
import { Sparkles, Calendar, X } from 'lucide-react';
import { companyInfo } from '../constants/companyInfo';

const AIChatPrompt = ({ onStartChat, onScheduleMeeting, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Section - Dark Purple/Black */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-6 pb-8">
          {/* Profile Pictures */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center overflow-hidden -ml-3">
              <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center overflow-hidden -ml-3">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            👋 Pricing questions?
          </h2>

          {/* Subtitle */}
          <p className="text-purple-100 text-sm">
            Schedule a meeting with our sales team at your convenience! 🙌⬇️🙌
          </p>
        </div>

        {/* Body Section - Light Purple/White */}
        <div className="bg-gradient-to-b from-purple-50 to-white p-6 space-y-3">
          {/* Buttons */}
          <button
            onClick={onScheduleMeeting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-md"
          >
            Schedule a meeting
          </button>

          <button
            onClick={onStartChat}
            className="w-full bg-purple-500/80 hover:bg-purple-500 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Chat with our AI Agent
          </button>

          {/* Privacy Policy Link */}
          <p className="text-xs text-gray-500 text-center mt-4">
            This chat may be recorded as described in our{' '}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 underline hover:text-purple-700"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatPrompt;

