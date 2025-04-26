import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanionData, MessageData, getConversation, sendMessage, speakText } from "@/lib/openai";
import AvatarDisplay from "./AvatarDisplay";

interface ChatInterfaceProps {
  companionId: number;
  companionData: CompanionData;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ companionId, companionData }) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [useVoice, setUseVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Get conversation data
  const { data: conversation, isLoading } = useQuery({
    queryKey: [`/api/companions/${companionId}/conversation`],
    refetchInterval: false,
  });

  // Send message mutation
  const { mutate: sendMessageMutation, isPending: isSending } = useMutation({
    mutationFn: async (content: string) => {
      return sendMessage(companionId, content);
    },
    onSuccess: (data) => {
      // Play the response as audio if voice is enabled
      if (useVoice) {
        speakText(data.message.content, companionData.voiceType);
      }
      
      // Update the conversation in cache
      queryClient.invalidateQueries({ 
        queryKey: [`/api/companions/${companionId}/conversation`] 
      });
    },
    onError: (error) => {
      toast({
        title: "Message failed",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    }
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  // Filter out system messages for display
  const displayMessages = conversation?.messages.filter(
    (msg: MessageData) => msg.role !== "system"
  ) || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;
    
    sendMessageMutation(message);
    setMessage("");
  };

  const toggleVoice = () => {
    setUseVoice(!useVoice);
    
    if (!useVoice) {
      toast({
        title: "Voice enabled",
        description: "Responses will now be spoken aloud.",
      });
    } else {
      // Stop any current speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-medium overflow-hidden mb-20">
      <div className="flex flex-col md:flex-row h-[600px]">
        {/* Avatar display */}
        <AvatarDisplay 
          companion={companionData} 
          useVoice={useVoice} 
          onToggleVoice={toggleVoice} 
        />
        
        {/* Chat interface */}
        <div className="w-full md:w-2/3 flex flex-col h-full">
          {/* Chat header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-lavender/20 flex items-center justify-center">
                <span className="text-lavender font-medium">
                  {companionData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{companionData.name}</h3>
                <p className="text-xs text-neutral-medium">Memory Companion</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="text-neutral-medium hover:text-neutral-dark">
                <i className="fa-solid fa-download"></i>
              </button>
              <button className="text-neutral-medium hover:text-neutral-dark">
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </button>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 bg-neutral-lightest">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 border-4 border-t-lavender border-r-lavender border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
            ) : displayMessages.length === 0 ? (
              <div className="bg-neutral-light/50 rounded-lg p-3 text-sm text-neutral-dark/80 mx-auto max-w-md text-center">
                Your memory companion is ready. Start a conversation to connect.
              </div>
            ) : (
              <>
                {displayMessages.map((msg: MessageData) => (
                  <div 
                    key={msg.id}
                    className={`flex items-start max-w-md ${msg.role === 'user' ? 'ml-auto' : ''}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-3 mt-1">
                        <img 
                          src={companionData.avatarUrl} 
                          alt="Avatar" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    
                    <div className={`${
                      msg.role === 'assistant' 
                        ? 'bg-white rounded-lg rounded-tl-none p-4 shadow-soft' 
                        : 'bg-lavender/10 rounded-lg rounded-tr-none p-4'
                    }`}>
                      <p className="text-neutral-dark">{msg.content}</p>
                    </div>
                    
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-lavender/20 flex items-center justify-center ml-3 mt-1">
                        <span className="text-lavender font-medium text-sm">You</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {isSending && (
                  <div className="flex items-start max-w-md">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3 mt-1">
                      <img 
                        src={companionData.avatarUrl} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-soft">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-neutral-light rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-neutral-light rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-neutral-light rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex items-center">
              <button 
                type="button"
                className="text-neutral-medium hover:text-neutral-dark p-2" 
                disabled
              >
                <i className="fa-solid fa-image"></i>
              </button>
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..." 
                  className="w-full py-2.5 px-4 bg-neutral-lightest rounded-full focus:outline-none focus:ring-2 focus:ring-lavender/30"
                  disabled={isSending}
                />
              </div>
              <button 
                type="submit"
                className={`ml-2 w-10 h-10 bg-lavender rounded-full flex items-center justify-center text-white ${
                  isSending || !message.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-lavender-dark'
                }`} 
                disabled={isSending || !message.trim()}
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
            <p className="mt-2 text-xs text-neutral-medium text-center">Your conversations are private and secure.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
