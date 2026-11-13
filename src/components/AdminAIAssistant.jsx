import React, { useState, useRef, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

export const AdminAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Salam Admin! Main Memon Traders AI Assistant hoon. Batayein kya help karoon?' }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const data = await apiClient('/ai/admin-query', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage })
      });

      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error connecting to AI agent: ' + (err.message || 'Server error') }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-brandOrange hover:bg-brandOrange-hover text-white p-4 rounded-full shadow-2xl flex items-center space-x-2 transition transform hover:scale-105 border border-brandOrange/30"
          title="Open Admin AI Assistant"
        >
          <Sparkles size={22} className="animate-pulse" />
          <span className="font-bold text-sm hidden sm:inline">AI Assistant</span>
        </button>
      ) : (
        <div className="bg-charcoal border border-charcoal-light w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Chat Header */}
          <div className="bg-charcoal-dark p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-brandOrange/20 text-brandOrange rounded-xl border border-brandOrange/30">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm flex items-center space-x-1">
                  <span>Memon Traders AI</span>
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                </h3>
                <p className="text-[10px] text-gray-400">Database Connected Agent</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-charcoal/50 text-xs">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-1.5 rounded-xl ${msg.sender === 'user' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-brandOrange/20 text-brandOrange border border-brandOrange/30'}`}>
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`max-w-[75%] p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-charcoal-dark text-gray-200 border border-gray-800 rounded-tl-none font-medium'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-gray-400 text-xs p-2">
                <Loader2 size={14} className="animate-spin text-brandOrange" />
                <span>AI is analyzing database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-charcoal-dark border-t border-gray-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask about sales, stock, order 1001..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-charcoal text-white text-xs rounded-xl px-3.5 py-2.5 border border-gray-700 focus:border-brandOrange focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-brandOrange hover:bg-brandOrange-hover text-white p-2.5 rounded-xl transition shadow-md shadow-brandOrange/20 disabled:opacity-50 flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};