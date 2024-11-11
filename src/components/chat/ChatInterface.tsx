import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Sparkles, User } from 'lucide-react';
import { Message } from '@/types/chat';

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatComplete, setIsChatComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const getInitialMessage = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [] })
        });

        if (!response.ok) throw new Error('Failed to get initial message');

        const data = await response.json();
        if (!data.success && data.error) {
          throw new Error(data.error);
        }

        const initialMessage: Message = {
          role: 'assistant',
          content: data.response
        };

        setMessages([initialMessage]);
      } catch (error) {
        console.error('Error getting initial message:', error);
        // Add an error message to the chat
        setMessages([{
          role: 'assistant',
          content: 'Sorry, I had trouble starting our chat. Please try refreshing the page! 🙏'
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialMessage();
    inputRef.current?.focus();
  }, []);

  const processConversation = async (messages: Message[]) => {
    setIsProcessing(true);
    try {
      // Extract data
      const extractResponse = await fetch('/api/extract-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });

      if (!extractResponse.ok) {
        const errorData = await extractResponse.json();
        throw new Error(errorData.error || 'Failed to extract data');
      }

      const { data: extractedData } = await extractResponse.json();

      // Ensure the extracted data has all required fields with defaults
      const processedData = {
        satisfaction: extractedData.satisfaction ?? 0,
        pain_points: extractedData.pain_points ?? [],
        feature_requests: extractedData.feature_requests ?? [],
        contact: {
          method: extractedData.contact?.method ?? null,
          value: extractedData.contact?.value ?? null
        },
        sentiment: extractedData.sentiment ?? 'neutral',
        key_themes: extractedData.key_themes ?? []
      };

      // Convert messages to a format Prisma can handle
      const processedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Save conversation
      const saveResponse = await fetch('/api/save-extracted-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: processedMessages,
          extractedData: processedData
        })
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        console.error('Save error:', errorData);
        throw new Error(errorData.error || 'Failed to save conversation');
      }

      const saveResult = await saveResponse.json();
      return saveResult.success;
    } catch (error) {
      console.error('Error processing conversation:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isProcessing) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);

      if (data.analysis) {
        setLastAnalysis(data.analysis);
      }

      if (data.isComplete && !isChatComplete) {
        setIsChatComplete(true);
        const success = await processConversation(updatedMessages);

        if (!success) {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: 'I saved your feedback but encountered a small error in processing. No worries though, your insights are valuable and have been recorded! 🙏'
            }
          ]);
        }
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again! 🙏'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDebugInfo = () => {
    if (!lastAnalysis || !lastAnalysis.missingElements.length || isChatComplete) return null;

    return (
        <div className="p-2 text-xs text-gray-500 border-t border-gray-200">
          <p>Missing information: {lastAnalysis.missingElements.join(', ')}</p>
        </div>
    );
  };

  return (
      <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 font-sans bg-gray-50">
        {/* Header */}
        <div className="text-center mb-4 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Product Feedback</h1>
          <p className="text-gray-600">We&#39;d love to hear your thoughts! ✨</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 rounded-lg bg-white shadow-sm">
          {messages.map((message, index) => (
              <div
                  key={index}
                  className={`flex items-start space-x-2 animate-fadeIn ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                )}
                <div
                    className={`max-w-sm rounded-2xl p-4 transition-all duration-300 ${
                        message.role === 'user'
                            ? 'bg-purple-500 text-white ml-12 shadow-md hover:shadow-lg'
                            : 'bg-gray-100 text-gray-800 mr-12 shadow-sm hover:shadow-md'
                    }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                )}
              </div>
          ))}
          {(isLoading || isProcessing) && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-4 shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                  <span className="text-sm text-gray-500">
                {isProcessing ? "Processing your feedback..." : "Nova is thinking..."}
              </span>
                </div>
              </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <form onSubmit={sendMessage} className="relative">
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-full pl-6 pr-16 py-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || isProcessing || isChatComplete}
            />
            <button
                type="submit"
                disabled={isLoading || isProcessing || !input.trim() || isChatComplete}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-500 text-white rounded-full p-3 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {process.env.NODE_ENV === 'development' && renderDebugInfo()}

          {isChatComplete && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg animate-fadeIn">
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5 text-green-500" />
                  <span>Thanks for your amazing feedback! Your insights will help us make the product even better! ✨</span>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default ChatInterface;