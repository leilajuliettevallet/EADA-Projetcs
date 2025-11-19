
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { createChatSession } from '../services/geminiService';
import { SendIcon, XMarkIcon, SpinnerIcon, LeilaAvatarIcon } from './Icons';

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello there! I'm LeilAI. Ready to keep your fitness timeless and on track? Ask me anything!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatSession.current) {
      chatSession.current = createChatSession();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession.current) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const result = await chatSession.current.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Oh dear, connection glitch! Let's try that again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose} />
      
      <div className="bg-dark-card w-full sm:w-[400px] sm:h-[600px] h-[85vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out border border-white/50">
        {/* Header */}
        <div className="p-4 border-b border-dark-border flex justify-between items-center bg-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
             <div className="bg-brand-blue/10 p-1 rounded-full">
                <LeilaAvatarIcon className="w-10 h-10" />
             </div>
             <div>
                <h3 className="text-brand-blue font-extrabold text-lg leading-tight">LeilAI</h3>
                <span className="text-xs text-brand-green font-medium">Online & Ready</span>
             </div>
          </div>
          <button onClick={onClose} className="text-medium-text hover:bg-dark-bg rounded-full p-2 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-bg">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-brand-blue text-white rounded-tr-sm' 
                  : 'bg-white text-light-text rounded-tl-sm border border-dark-border'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-dark-border shadow-sm">
                <SpinnerIcon className="w-5 h-5 animate-spin text-brand-blue" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-dark-border bg-white sm:rounded-b-2xl">
          <div className="flex space-x-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask LeilAI..."
              className="flex-1 bg-dark-bg text-light-text border border-dark-border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1.5 bg-brand-blue text-white p-1.5 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
