import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Loader2, User, Bot, X } from 'lucide-react';
import { createConversation, sendMessage as sendConversationMessage } from '../../services/api';

const AIChatInterface = ({ tripId, onAdaptItinerary, isVisible, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your AI travel assistant. I can help you customize your itinerary. Try asking me to:\n\n• "Add more outdoor activities"\n• "Suggest vegetarian restaurants"\n• "Make it more budget-friendly"\n• "What if it rains?"\n• "Replace Day 2 with museums"\n\nWhat would you like to change?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const initializeConversation = useCallback(async () => {
    if (!tripId) return;
    setInitializing(true);
    try {
      const response = await createConversation(tripId);
      setConversationId(response.data.conversationId);
    } catch (error) {
      console.warn('Could not create conversation on backend, using local mode:', error);
    } finally {
      setInitializing(false);
    }
  }, [tripId]);

  // Initialize or fetch conversation when chat opens
  useEffect(() => {
    if (isVisible && tripId && !conversationId && !initializing) {
      initializeConversation();
    }
  }, [isVisible, tripId, conversationId, initializing, initializeConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const quickSuggestions = [
    "Add more adventure activities",
    "Reduce the budget",
    "Suggest indoor alternatives",
    "Make it more family-friendly",
    "Focus on local cuisine",
    "Add more free activities"
  ];

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // First, try to save the message to the backend conversation
      if (conversationId) {
        try {
          await sendConversationMessage(conversationId, userMessage);
        } catch (convError) {
          console.warn('Could not save message to backend conversation:', convError);
        }
      }

      // Apply the itinerary adaptation (this is the main action)
      await onAdaptItinerary(userMessage);
      
      // Generate AI-like response based on the adaptation context
      const responses = {
        'adventure': "I've updated your itinerary with more adventure activities! The changes include: adding outdoor excursions, adventure sports, and nature trails. Check out the updated schedule above.",
        'budget': "I've adjusted the itinerary to be more budget-friendly! The changes include: more free activities, budget dining options, and cost-effective transportation suggestions.",
        'rain': "I've added indoor alternatives throughout your itinerary! The changes include: indoor attractions, rainy-day activities, and covered dining options. Your trip is now weather-proof!",
        'food': "I've enhanced the food experiences in your itinerary! The changes include: local cuisine recommendations, food tours, and top-rated restaurants for each meal time.",
        'family': "I've made your itinerary more family-friendly! The changes include: kid-friendly activities, family restaurants, and age-appropriate suggestions for everyone."
      };
      
      let responseText = "I've updated your itinerary based on your request. The changes have been applied to optimize your travel experience. You can view the updated itinerary above. Is there anything else you'd like to adjust?";
      
      const lowerMsg = userMessage.toLowerCase();
      if (lowerMsg.includes('adventure') || lowerMsg.includes('outdoor') || lowerMsg.includes('active')) {
        responseText = responses.adventure;
      } else if (lowerMsg.includes('budget') || lowerMsg.includes('cheap') || lowerMsg.includes('cheaper') || lowerMsg.includes('free') || lowerMsg.includes('cost')) {
        responseText = responses.budget;
      } else if (lowerMsg.includes('rain') || lowerMsg.includes('indoor') || lowerMsg.includes('weather')) {
        responseText = responses.rain;
      } else if (lowerMsg.includes('food') || lowerMsg.includes('restaurant') || lowerMsg.includes('cuisine') || lowerMsg.includes('eat') || lowerMsg.includes('dining') || lowerMsg.includes('vegetarian')) {
        responseText = responses.food;
      } else if (lowerMsg.includes('family') || lowerMsg.includes('kid') || lowerMsg.includes('children')) {
        responseText = responses.family;
      }
      
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: responseText }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error while updating your itinerary. Please try again or contact support if the issue persists.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSuggestion = (suggestion) => {
    setInput(suggestion);
    handleSendMessage(suggestion);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-4 py-3 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">AI Travel Assistant</h3>
            <p className="text-pink-100 text-xs">Customize your itinerary</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'user'
                ? 'bg-pink-600'
                : 'bg-gradient-to-br from-pink-500 to-pink-600'
            }`}>
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 text-pink-600 animate-spin" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Updating your itinerary...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {!isLoading && messages.length < 5 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center space-x-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to customize your trip..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white hover:from-pink-500 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatInterface;