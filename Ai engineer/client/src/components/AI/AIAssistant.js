import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const AssistantContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
`;

const ChatSubtitle = styled.p`
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  opacity: 0.9;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background: ${props => props.isUser ? '#3b82f6' : '#f3f4f6'};
  color: ${props => props.isUser ? 'white' : '#374151'};
  font-size: 0.875rem;
  line-height: 1.4;
`;

const MessageTime = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0 0.5rem;
`;

const SuggestionCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0.5rem 0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const SuggestionTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

const SuggestionDescription = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  color: #6b7280;
`;

const SuggestionActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SuggestionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &.primary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;

    &:hover {
      background: #2563eb;
    }
  }
`;

const ChatInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  resize: none;
  min-height: 40px;
  max-height: 120px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SendButton = styled.button`
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const QuickActionButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 0.25rem;

  span {
    width: 4px;
    height: 4px;
    background: #6b7280;
    border-radius: 50%;
    animation: bounce 1.4s ease-in-out infinite both;

    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const AIAssistant = ({ floorplanData, onSuggestionApply }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI design assistant. I can help you optimize your floorplan, suggest furniture layouts, recommend color schemes, and much more. What would you like to work on?",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        {
          id: 1,
          title: "Optimize Room Layout",
          description: "Analyze your current layout and suggest improvements for better flow and functionality.",
          action: "optimize_layout"
        },
        {
          id: 2,
          title: "Suggest Furniture",
          description: "Get AI-powered furniture recommendations based on room types and dimensions.",
          action: "suggest_furniture"
        },
        {
          id: 3,
          title: "Color Scheme Ideas",
          description: "Generate color palettes that match your style preferences.",
          action: "color_schemes"
        }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    "Optimize room layout",
    "Suggest furniture placement",
    "Recommend color schemes",
    "Improve lighting design",
    "Add storage solutions",
    "Create open floor plan",
    "Design modern kitchen",
    "Plan bathroom layout"
  ];

  const generateAIResponse = async (userMessage) => {
    setIsLoading(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI responses based on user input
    let response = "";
    let suggestions = [];
    
    const message = userMessage.toLowerCase();
    
    if (message.includes('layout') || message.includes('optimize')) {
      response = "I've analyzed your floorplan and found several optimization opportunities:\n\n• The living room could benefit from better furniture placement for improved flow\n• Consider adding a hallway to separate private and public areas\n• The kitchen layout could be more efficient with an island or peninsula\n\nWould you like me to apply these suggestions?";
      suggestions = [
        {
          id: Date.now() + 1,
          title: "Apply Layout Optimization",
          description: "Implement the suggested layout improvements",
          action: "apply_layout_optimization"
        },
        {
          id: Date.now() + 2,
          title: "Show Alternative Layouts",
          description: "Generate 3 different layout options",
          action: "show_alternatives"
        }
      ];
    } else if (message.includes('furniture') || message.includes('furnish')) {
      response = "Based on your room dimensions and types, here are my furniture recommendations:\n\n• Living Room: 3-seat sofa, coffee table, TV stand, accent chairs\n• Kitchen: Kitchen island, dining table for 4, bar stools\n• Bedroom: Queen bed, nightstands, dresser, wardrobe\n\nI can help you place these items optimally in your space.";
      suggestions = [
        {
          id: Date.now() + 1,
          title: "Add Recommended Furniture",
          description: "Place all suggested furniture items in your floorplan",
          action: "add_furniture"
        },
        {
          id: Date.now() + 2,
          title: "Show Furniture Options",
          description: "Browse different furniture styles and options",
          action: "browse_furniture"
        }
      ];
    } else if (message.includes('color') || message.includes('scheme')) {
      response = "Here are some beautiful color schemes that would work well with your space:\n\n• Modern Minimalist: White walls, black accents, natural wood\n• Warm & Cozy: Cream walls, warm browns, soft blues\n• Contemporary: Gray walls, navy accents, gold highlights\n• Scandinavian: Light grays, white, natural textures\n\nWhich style appeals to you most?";
      suggestions = [
        {
          id: Date.now() + 1,
          title: "Apply Modern Minimalist",
          description: "Use white, black, and natural wood color scheme",
          action: "apply_color_scheme",
          data: { scheme: 'modern_minimalist' }
        },
        {
          id: Date.now() + 2,
          title: "Apply Warm & Cozy",
          description: "Use cream, brown, and soft blue color scheme",
          action: "apply_color_scheme",
          data: { scheme: 'warm_cozy' }
        }
      ];
    } else if (message.includes('lighting') || message.includes('light')) {
      response = "Great lighting can transform your space! Here are my recommendations:\n\n• Add recessed lighting in the kitchen and living areas\n• Install pendant lights over the dining table\n• Use floor lamps for ambient lighting in bedrooms\n• Consider LED strip lighting under kitchen cabinets\n• Add dimmer switches for mood control\n\nWould you like me to show you where to place these fixtures?";
      suggestions = [
        {
          id: Date.now() + 1,
          title: "Add Lighting Fixtures",
          description: "Place recommended lighting throughout your floorplan",
          action: "add_lighting"
        }
      ];
    } else {
      response = "I understand you're looking for help with your floorplan design. I can assist with:\n\n• Room layout optimization\n• Furniture placement and selection\n• Color scheme recommendations\n• Lighting design\n• Storage solutions\n• Space planning\n\nWhat specific aspect would you like to work on?";
    }
    
    setIsLoading(false);
    
    return {
      text: response,
      suggestions: suggestions
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    const aiResponse = await generateAIResponse(inputValue);
    
    const aiMessage = {
      id: Date.now() + 1,
      text: aiResponse.text,
      isUser: false,
      timestamp: new Date(),
      suggestions: aiResponse.suggestions
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
    handleSendMessage();
  };

  const handleSuggestionAction = async (suggestion) => {
    switch (suggestion.action) {
      case 'apply_layout_optimization':
        toast.success('Layout optimization applied!');
        // Here you would apply the actual layout changes to the floorplan
        if (onSuggestionApply) {
          onSuggestionApply({
            type: 'layout_optimization',
            data: suggestion.data
          });
        }
        break;
      case 'add_furniture':
        toast.success('Furniture added to your floorplan!');
        if (onSuggestionApply) {
          onSuggestionApply({
            type: 'add_furniture',
            data: suggestion.data
          });
        }
        break;
      case 'apply_color_scheme':
        toast.success(`${suggestion.data.scheme} color scheme applied!`);
        if (onSuggestionApply) {
          onSuggestionApply({
            type: 'color_scheme',
            data: suggestion.data
          });
        }
        break;
      case 'add_lighting':
        toast.success('Lighting fixtures added!');
        if (onSuggestionApply) {
          onSuggestionApply({
            type: 'add_lighting',
            data: suggestion.data
          });
        }
        break;
      default:
        toast.info('Feature coming soon!');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AssistantContainer>
      <ChatHeader>
        <ChatTitle>🤖 AI Design Assistant</ChatTitle>
        <ChatSubtitle>Get personalized design recommendations</ChatSubtitle>
      </ChatHeader>

      <ChatMessages>
        {messages.map((message) => (
          <Message key={message.id} isUser={message.isUser}>
            <MessageBubble isUser={message.isUser}>
              {message.text}
            </MessageBubble>
            <MessageTime>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </MessageTime>
            
            {message.suggestions && message.suggestions.length > 0 && (
              <div style={{ width: '100%', marginTop: '0.5rem' }}>
                {message.suggestions.map((suggestion) => (
                  <SuggestionCard key={suggestion.id}>
                    <SuggestionTitle>{suggestion.title}</SuggestionTitle>
                    <SuggestionDescription>{suggestion.description}</SuggestionDescription>
                    <SuggestionActions>
                      <SuggestionButton
                        className="primary"
                        onClick={() => handleSuggestionAction(suggestion)}
                      >
                        Apply
                      </SuggestionButton>
                      <SuggestionButton>
                        Learn More
                      </SuggestionButton>
                    </SuggestionActions>
                  </SuggestionCard>
                ))}
              </div>
            )}
          </Message>
        ))}
        
        {isLoading && (
          <Message isUser={false}>
            <MessageBubble isUser={false}>
              <LoadingMessage>
                <span>AI is thinking</span>
                <LoadingDots>
                  <span></span>
                  <span></span>
                  <span></span>
                </LoadingDots>
              </LoadingMessage>
            </MessageBubble>
          </Message>
        )}
        
        <div ref={messagesEndRef} />
      </ChatMessages>

      <ChatInput>
        <QuickActions>
          {quickActions.map((action, index) => (
            <QuickActionButton
              key={index}
              onClick={() => handleQuickAction(action)}
              disabled={isLoading}
            >
              {action}
            </QuickActionButton>
          ))}
        </QuickActions>
        
        <InputContainer>
          <MessageInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your design..."
            disabled={isLoading}
          />
          <SendButton
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
          >
            ➤
          </SendButton>
        </InputContainer>
      </ChatInput>
    </AssistantContainer>
  );
};

export default AIAssistant;
