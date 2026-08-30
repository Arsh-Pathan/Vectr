import React, { useState, useRef, useEffect } from 'react';
import Card from '../common/Card';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import api from '../../config/api';

export default function ChatWindow({ issueId }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your Guidance Agent. Ask me anything about this issue and I will guide you — without giving away the answer!' }
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

    const userMessage = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSuggestions([]);
    setIsTyping(true);

    try {
      // POST /api/issues/:id/chat
      const res = await api.post(`/issues/${issueId}/chat`, { message: trimmed });
      const { response, follow_up_suggestions } = res.data;

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setSuggestions(follow_up_suggestions || []);
    } catch (error) {
      const detail = error.response?.data?.detail || error.message;
      console.error('Chat error:', detail);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${detail}`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="flex flex-col h-[500px]" hover={false}>
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
        <Sparkles size={18} className="text-google-blue" />
        <h3 className="font-bold text-gray-900">Support Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-google-blue'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] ${
              msg.role === 'user'
                ? 'bg-gray-100 text-gray-900 rounded-tr-sm'
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-google-blue flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 rounded-tl-sm shadow-sm flex gap-1 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              className="text-xs font-medium bg-blue-50 text-google-blue border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors text-left"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

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
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-google-blue focus:bg-white transition-all disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="w-9 h-9 rounded-full bg-google-blue text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          <Send size={16} className="-ml-0.5" />
        </button>
      </form>
    </Card>
  );
}
