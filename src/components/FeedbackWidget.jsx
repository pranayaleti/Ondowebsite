import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, X, CheckCircle, AlertCircle, List, Send, Calendar, Loader2 } from 'lucide-react';
import { API_URL } from '../utils/apiConfig.js';
import { useAuth } from '../contexts/AuthContext';
import { formatDateTimeUserTimezone } from '../utils/dateFormat.js';

const FeedbackWidget = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' or 'view'
  const [feedbackType, setFeedbackType] = useState(null); // 'compliment', 'comment', 'complaint'
  const [rating, setRating] = useState(null); // 'up', 'down', 'neutral'
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error'
  const [userFeedback, setUserFeedback] = useState([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);

  const fetchUserFeedback = async () => {
    setIsLoadingFeedback(true);
    setFeedbackError(null);
    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }

      const data = await response.json();
      setUserFeedback(data.feedback || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setFeedbackError('Failed to load feedback');
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  // Fetch user's feedback
  useEffect(() => {
    if (isOpen && activeTab === 'view' && isAuthenticated) {
      fetchUserFeedback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeTab, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackType || !rating) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: feedbackType,
          rating: rating,
          description: description.trim() || null,
          page_url: window.location.href,
          user_agent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSubmitStatus('success');
      
      // Refresh feedback list if viewing
      if (activeTab === 'view' && isAuthenticated) {
        fetchUserFeedback();
      }
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFeedbackType(null);
        setRating(null);
        setDescription('');
        setSubmitStatus(null);
        if (activeTab === 'view') {
          // Don't close if viewing feedback
        } else {
          setIsOpen(false);
        }
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveTab('submit');
    setFeedbackType(null);
    setRating(null);
    setDescription('');
    setSubmitStatus(null);
    setUserFeedback([]);
    setFeedbackError(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSubmitStatus(null);
    if (tab === 'view' && isAuthenticated) {
      fetchUserFeedback();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 z-50 flex items-center gap-2 group"
        aria-label="Submit feedback"
      >
        <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline font-medium">Feedback</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-96 max-w-[calc(100vw-3rem)] z-50 max-h-[80vh] flex flex-col">
      <div className="p-6 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Feedback</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close feedback form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-neutral-700">
          <button
            onClick={() => handleTabChange('submit')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'submit'
                ? 'text-orange-500 border-orange-500'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Submit
            </div>
          </button>
          {isAuthenticated && (
            <button
              onClick={() => handleTabChange('view')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'view'
                  ? 'text-orange-500 border-orange-500'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <List className="w-4 h-4" />
                View ({userFeedback.length})
              </div>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">

        {activeTab === 'submit' ? (
          <>
            {submitStatus === 'success' ? (
              <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                <CheckCircle className="text-green-500 flex-shrink-0" />
                <p className="text-green-400">Thank you for your feedback!</p>
              </div>
            ) : submitStatus === 'error' ? (
              <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg mb-4">
                <AlertCircle className="text-red-500 flex-shrink-0" />
                <p className="text-red-400">Failed to submit. Please try again.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
            {/* Feedback Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['compliment', 'comment', 'complaint'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFeedbackType(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      feedbackType === type
                        ? 'bg-orange-500 text-white'
                        : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setRating('up')}
                  className={`p-3 rounded-lg transition-all ${
                    rating === 'up'
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : 'bg-neutral-800 border-2 border-transparent hover:bg-neutral-700'
                  }`}
                  aria-label="Thumbs up"
                >
                  <ThumbsUp
                    className={`w-6 h-6 ${
                      rating === 'up' ? 'text-green-500' : 'text-gray-400'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setRating('neutral')}
                  className={`p-3 rounded-lg transition-all ${
                    rating === 'neutral'
                      ? 'bg-yellow-500/20 border-2 border-yellow-500'
                      : 'bg-neutral-800 border-2 border-transparent hover:bg-neutral-700'
                  }`}
                  aria-label="Neutral"
                >
                  <span
                    className={`text-2xl ${
                      rating === 'neutral' ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  >
                    →
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRating('down')}
                  className={`p-3 rounded-lg transition-all ${
                    rating === 'down'
                      ? 'bg-red-500/20 border-2 border-red-500'
                      : 'bg-neutral-800 border-2 border-transparent hover:bg-neutral-700'
                  }`}
                  aria-label="Thumbs down"
                >
                  <ThumbsDown
                    className={`w-6 h-6 ${
                      rating === 'down' ? 'text-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Optional Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us more about your feedback..."
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows="3"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/1000 characters
              </p>
            </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!feedbackType || !rating || isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </>
        ) : activeTab === 'view' ? (
          <div className="space-y-3">
            {!isAuthenticated ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-2">Please sign in to view your feedback</p>
              </div>
            ) : isLoadingFeedback ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
              </div>
            ) : feedbackError ? (
              <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                <AlertCircle className="text-red-500 flex-shrink-0" />
                <p className="text-red-400">{feedbackError}</p>
              </div>
            ) : userFeedback.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No feedback submitted yet</p>
                <p className="text-sm text-gray-500 mt-1">Submit your first feedback to see it here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userFeedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        feedback.rating === 'up' 
                          ? 'bg-green-500/20 text-green-400'
                          : feedback.rating === 'down'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {feedback.rating === 'up' ? (
                          <ThumbsUp className="w-4 h-4" />
                        ) : feedback.rating === 'down' ? (
                          <ThumbsDown className="w-4 h-4" />
                        ) : (
                          <span className="text-sm">→</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            feedback.type === 'compliment'
                              ? 'bg-green-500/20 text-green-400'
                              : feedback.type === 'complaint'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDateTimeUserTimezone(feedback.created_at)}
                          </span>
                        </div>
                        {feedback.description && (
                          <p className="text-sm text-gray-300 mt-2">{feedback.description}</p>
                        )}
                        {feedback.page_url && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {new URL(feedback.page_url).pathname}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
        </div>
      </div>
    </div>
  );
};

export default FeedbackWidget;

