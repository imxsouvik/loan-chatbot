import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { getBotResponse } from '@/lib/conversation';
import './Chatbot.css';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  options?: string[];
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      const initialBotMessage = getBotResponse('hello');
      setMessages([
        {
          text: initialBotMessage.text,
          sender: 'bot',
          options: initialBotMessage.options,
        },
      ]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputValue;
    if (text.trim() === '') return;

    const userMessage: Message = { text, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) {
      setInputValue('');
    }

    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: Message = {
        text: botResponse.text,
        sender: 'bot',
        options: botResponse.options,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('div');
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messages]);

  return (
    <>
      <div className="chatbot-fab" onClick={toggleChatbot}>
        <button className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>

      {isOpen && (
        <div className="chatbot-window fixed bottom-24 right-5 w-80 h-[450px] bg-card shadow-lg rounded-lg border flex flex-col animate-slide-in-up">
          <div className="chatbot-header flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
            <h3 className="font-semibold">LoanGenie Assistant</h3>
            <button onClick={toggleChatbot} className="hover:opacity-75">
              <X className="h-5 w-5" />
            </button>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index}>
                  <div
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'justify-end' : ''
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Bot className="h-5 w-5" />
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.text}
                    </div>
                    {message.sender === 'user' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  {message.sender === 'bot' && message.options && (
                    <div className="mt-2 flex flex-wrap gap-2 justify-start ml-12">
                      {message.options.map((option, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendMessage(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="chatbot-input p-4 border-t">
            <div className="relative">
              <Input
                placeholder="Type a message..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-12"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => handleSendMessage()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;