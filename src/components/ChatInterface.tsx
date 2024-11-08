import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hi! I\'m here to collect feedback about your experience. How has our product been working for you?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatComplete, setIsChatComplete] = useState(false);
  const [userId] = useState(() => uuidv4()); // Generate unique user ID
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const processFeedback = async (conversationId: string) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId })
      });

      if (!response.ok) {
        throw new Error('Failed to process feedback');
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing feedback:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      const botMessage: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, botMessage]);

      // Check if conversation looks complete (has contact info or rejection)
      const lastMessages = [...messages, userMessage, botMessage];
      const isComplete = lastMessages.some(msg => 
        msg.content.toLowerCase().includes('thank you for your feedback') ||
        msg.content.toLowerCase().includes('thanks for your feedback')
      );

      if (isComplete && !isChatComplete) {
        setIsChatComplete(true);
        if (data.conversationId) {
          await processFeedback(data.conversationId);
        }
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 font-sans">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Feedback Assistant</h1>
        <p className="text-gray-600">We&apos;d love to hear your thoughts!</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 rounded-lg bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2 animate-fadeIn ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-sm rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-md ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white ml-12'
                  : 'bg-white text-gray-800 mr-12'
              }`}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="w-full rounded-full pl-6 pr-16 py-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md"
          disabled={isLoading || isChatComplete}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || isChatComplete}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      
      {isChatComplete && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg animate-fadeIn">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Thank you for your feedback! Your responses have been recorded.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;