import { useState } from "react";
import { useLocation } from "wouter";
import UploadStep from "@/components/UploadStep";
import PersonalityStep from "@/components/PersonalityStep";
import ProcessingStep from "@/components/ProcessingStep";
import ChatInterface from "@/components/ChatInterface";
import { CompanionData } from "@/lib/openai";

const CreateCompanion = () => {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showChat, setShowChat] = useState(false);
  const [compData, setCompData] = useState<Partial<CompanionData>>({
    name: "",
    description: "",
    avatarUrl: "",
    originalPhotoUrl: "",
    personality: "balanced",
    voiceType: "natural"
  });
  const [companionId, setCompanionId] = useState<number | null>(null);

  // Handle avatar image upload
  const handleImageUploaded = (avatarUrl: string, originalPhotoUrl: string) => {
    setCompData(prev => ({
      ...prev,
      avatarUrl,
      originalPhotoUrl
    }));
    setCurrentStep(2);
  };

  // Handle personality settings
  const handlePersonalitySet = (name: string, description: string, personality: string, voiceType: string) => {
    setCompData(prev => ({
      ...prev,
      name,
      description,
      personality,
      voiceType
    }));
    setCurrentStep(3);
  };

  // Handle companion creation completed
  const handleCreationCompleted = (id: number) => {
    setCompanionId(id);
    setShowChat(true);
  };

  // Handle back button from personality step
  const handleBackToUpload = () => {
    setCurrentStep(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
      {!showChat ? (
        <section id="create" className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-poppins text-2xl md:text-3xl font-semibold text-center mb-4">Create Your Memory Companion</h2>
            <p className="text-center text-neutral-dark/80 max-w-2xl mx-auto mb-12">A simple process to transform a photo into a meaningful digital connection.</p>
            
            {/* Step indicators */}
            <div className="flex justify-center mb-10">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-lavender text-white' : 'bg-neutral-light text-neutral-medium'} flex items-center justify-center font-medium`}>1</div>
                <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-lavender' : 'bg-neutral-light'}`}></div>
                <div className={`w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-lavender text-white' : 'bg-neutral-light text-neutral-medium'} flex items-center justify-center font-medium`}>2</div>
                <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-lavender' : 'bg-neutral-light'}`}></div>
                <div className={`w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-lavender text-white' : 'bg-neutral-light text-neutral-medium'} flex items-center justify-center font-medium`}>3</div>
              </div>
            </div>
            
            {/* Step content */}
            <div className="bg-white rounded-xl shadow-medium p-8 md:p-10">
              {currentStep === 1 && (
                <UploadStep onImageUploaded={handleImageUploaded} />
              )}
              
              {currentStep === 2 && (
                <PersonalityStep onPersonalitySet={handlePersonalitySet} onBack={handleBackToUpload} />
              )}
              
              {currentStep === 3 && (
                <ProcessingStep 
                  companionData={compData as CompanionData} 
                  onCreationCompleted={handleCreationCompleted} 
                />
              )}
            </div>
          </div>
        </section>
      ) : (
        <ChatInterface companionId={companionId!} companionData={compData as CompanionData} />
      )}
    </div>
  );
};

export default CreateCompanion;
