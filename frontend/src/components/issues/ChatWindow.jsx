import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Card from '../common/Card';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import api from '../../config/api';

// Typing indicator: 3-dot iMessage-style bounce
function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 text-google-blue flex items-center justify-center flex-shrink-0">
        <Bot size={16} />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-gray-200 shadow-sm flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDuration: '0.8s', animationDelay: '0ms' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDuration: '0.8s', animationDelay: '150ms' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDuration: '0.8s', animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}

// Gemini-style gradient avatar for the AI
function GeminiAvatar() {
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#8E75F0] to-[#4B8BEF]">
      <svg className="w-4 h-4 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2C14 2 14.5 10 20 14C14.5 18 14 26 14 26C14 26 13.5 18 8 14C13.5 10 14 2 14 2Z" fill="currentColor"/>
      </svg>
    </div>
  );
}

export default function ChatWindow({ issueId }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your **Guidance Agent** — powered by Gemini. Ask me anything about this issue and I'll guide you without giving away the answer! 🚀"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setSuggestions([]);
    setIsTyping(true);

    try {
      const res = await api.post(`/issues/${issueId}/chat`, { message: trimmed });
      const { response, follow_up_suggestions } = res.data;
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setSuggestions(follow_up_suggestions || []);
    } catch (error) {
      const detail = error.response?.data?.detail || error.message;
      console.error('Chat error:', detail);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I ran into an error: **${detail}**`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="flex flex-col h-[500px]" hover={false}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8E75F0] to-[#4B8BEF] flex items-center justify-center">
          <Sparkles size={12} className="text-white" />
        </div>
        <h3 className="font-bold text-gray-900">Gemini Guidance</h3>
        <span className="ml-auto text-[10px] font-semibold bg-gradient-to-r from-[#8E75F0] to-[#4B8BEF] bg-clip-text text-transparent uppercase tracking-widest">
          Powered by Gemini
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'user' ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
                <User size={16} />
              </div>
            ) : (
              <GeminiAvatar />
            )}

            <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[80%] ${
              msg.role === 'user'
                ? 'bg-gray-100 text-gray-900 rounded-tr-sm'
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-li:my-0 prose-ul:my-1 prose-strong:text-gray-900">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick-reply suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              className="text-xs font-medium bg-purple-50 text-[#8E75F0] border border-purple-100 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors text-left"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for guidance..."
          disabled={isTyping}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8E75F0] focus:bg-white transition-all disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-gradient-to-br from-[#8E75F0] to-[#4B8BEF] hover:opacity-90 shadow-sm"
        >
          <Send size={15} className="text-white -ml-0.5" />
        </button>
      </form>
    </Card>
  );
}
