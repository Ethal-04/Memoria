import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PersonalityStepProps {
  onPersonalitySet: (name: string, description: string, personality: string, voiceType: string) => void;
  onBack: () => void;
}

const PersonalityStep: React.FC<PersonalityStepProps> = ({ onPersonalitySet, onBack }) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [personality, setPersonality] = useState("balanced");
  const [voiceType, setVoiceType] = useState("natural");

  const handleContinue = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your memory companion.",
        variant: "destructive",
      });
      return;
    }

    onPersonalitySet(name, description, personality, voiceType);
  };

  return (
    <div>
      <h3 className="font-poppins text-xl font-medium mb-6">Personalize Your Companion</h3>
      <p className="mb-8 text-neutral-dark/80">
        These details will help your memory companion feel more authentic and meaningful.
      </p>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-dark mb-2">
            Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your loved one's name"
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-dark mb-2">
            Brief Description (Optional)
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A few words about your loved one to help guide the companion (e.g., gentle grandmother who loved gardening)"
            className="w-full min-h-[100px]"
          />
        </div>
        
        <div>
          <label htmlFor="personality" className="block text-sm font-medium text-neutral-dark mb-2">
            Personality Style
          </label>
          <Select value={personality} onValueChange={setPersonality}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select personality style" />
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
        
        <div>
          <label htmlFor="voice" className="block text-sm font-medium text-neutral-dark mb-2">
            Voice Type
          </label>
          <Select value={voiceType} onValueChange={setVoiceType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select voice type" />
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
      
      <div className="flex justify-between mt-10">
        <button 
          className="px-6 py-2.5 text-neutral-dark bg-neutral-light rounded-full font-medium hover:bg-neutral-light/80 transition-all"
          onClick={onBack}
        >
          Back
        </button>
        <button 
          className="px-8 py-2.5 bg-gradient-to-r from-lavender to-teal text-white rounded-full font-medium hover:shadow-medium transition-all"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PersonalityStep;
