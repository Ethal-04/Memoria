import { useState, useEffect } from "react";
import { CompanionData } from "@/lib/openai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ThreeDimensionalAvatar from "./3DAvatarDisplay";

interface AvatarDisplayProps {
  companion: CompanionData;
  useVoice: boolean;
  onToggleVoice: () => void;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ 
  companion, 
  useVoice, 
  onToggleVoice 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  
  const [isActive, setIsActive] = useState(false);

  // This would be set to true when the companion is speaking 
  // to activate facial expressions
  useEffect(() => {
    // This is a placeholder for real message activity
    // In a real implementation, we'd detect when new messages arrive
    const checkMessageInterval = setInterval(() => {
      const lastMessage = document.querySelector('.message:last-child');
      if (lastMessage?.getAttribute('data-role') === 'assistant') {
        const timestamp = lastMessage?.getAttribute('data-timestamp');
        if (timestamp) {
          const messageTime = new Date(timestamp).getTime();
          const now = new Date().getTime();
          // If the message is less than 3 seconds old, consider the avatar active
          setIsActive(now - messageTime < 3000);
        }
      }
    }, 1000);

    return () => clearInterval(checkMessageInterval);
  }, []);

  return (
    <div className="w-full md:w-1/3 bg-gradient-to-b from-lavender/20 to-teal/20 p-6 flex flex-col">
      <div className="bg-white rounded-xl shadow-soft p-4 mb-6">
        <h3 className="font-poppins font-medium mb-2">Memory Companion</h3>
        <p className="text-sm text-neutral-medium mb-4">Crafted with care and respect</p>
        
        <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-neutral-light">
          <ThreeDimensionalAvatar 
            companion={companion}
            isActive={isActive}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-neutral-light text-neutral-dark rounded-lg text-sm flex items-center gap-2">
                <i className="fa-solid fa-sliders"></i> Settings
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Companion Settings</DialogTitle>
                <DialogDescription>
                  Adjust settings for your memory companion.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Personality Style</h4>
                  <Select defaultValue={companion.personality}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm">Warm & Supportive</SelectItem>
                      <SelectItem value="reflective">Thoughtful & Reflective</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="humorous">Lighthearted & Humorous</SelectItem>
                      <SelectItem value="wise">Wise & Insightful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Voice Type</h4>
                  <Select defaultValue={companion.voiceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural">Natural</SelectItem>
                      <SelectItem value="calm">Calm & Gentle</SelectItem>
                      <SelectItem value="warm">Warm & Friendly</SelectItem>
                      <SelectItem value="clear">Clear & Articulate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <button 
            className={`px-4 py-2 ${useVoice ? 'bg-teal' : 'bg-neutral-light text-neutral-dark'} rounded-lg text-sm flex items-center gap-2 ${useVoice ? 'text-white' : ''}`}
            onClick={onToggleVoice}
          >
            <i className={`fa-solid ${useVoice ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i> Voice
          </button>
        </div>
      </div>
      
      <div className="bg-white/80 rounded-xl shadow-soft p-4 mb-auto">
        <h4 className="font-medium mb-2">About this companion</h4>
        <p className="text-sm text-neutral-dark/80">
          This digital companion is created using AI to help process grief and maintain a connection 
          with your loved one. While it can mimic certain aspects of personality, it is a technological 
          representation, not a replacement.
        </p>
      </div>
      
      <a 
        href="https://www.nami.org/Support-Education/Publications-Reports/Guides/Navigating-a-Mental-Health-Crisis" 
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 px-4 py-2 border border-red-300 text-red-500 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
      >
        <i className="fa-solid fa-heart-crack"></i> Support Resources
      </a>
    </div>
  );
};

export default AvatarDisplay;
