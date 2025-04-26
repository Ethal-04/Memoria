import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { CompanionData, createCompanion } from "@/lib/openai";

interface ProcessingStepProps {
  companionData: CompanionData;
  onCreationCompleted: (id: number) => void;
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({ companionData, onCreationCompleted }) => {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Starting...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createMemoryCompanion = async () => {
      try {
        // Simulate progress for visual feedback
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval);
              return prev;
            }
            return prev + 10;
          });
        }, 800);
        
        // Simulate different processing stages for UX
        setTimeout(() => setStatus("Analyzing photo..."), 1000);
        setTimeout(() => setStatus("Creating digital representation..."), 3000);
        setTimeout(() => setStatus("Setting up conversational abilities..."), 5000);
        setTimeout(() => setStatus("Finalizing your memory companion..."), 7000);
        
        // Actually create the companion on the server
        const result = await createCompanion({
          ...companionData,
          userId: 1, // Default user ID since we don't have auth in this demo
        });
        
        // Ensure we reach 100% on successful completion
        setProgress(100);
        clearInterval(interval);
        
        setTimeout(() => {
          onCreationCompleted(result.id!);
        }, 1000);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        setStatus("Creation failed");
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to create memory companion",
          variant: "destructive",
        });
      }
    };

    createMemoryCompanion();
  }, []);

  return (
    <div className="text-center">
      <h3 className="font-poppins text-xl font-medium mb-6">Creating Your Memory Companion</h3>
      
      {!error ? (
        <>
          <div className="w-24 h-24 rounded-full bg-lavender/20 mx-auto mb-8 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-t-lavender border-r-lavender border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          
          <p className="mb-8 text-neutral-dark/80">{status}</p>
          
          <div className="mb-10">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-neutral-medium mt-2">{progress}% complete</p>
          </div>
          
          <div className="bg-blue/10 rounded-lg p-4 text-left mb-8 inline-block">
            <p className="text-sm text-neutral-dark/90 max-w-md">
              This process typically takes 15-30 seconds. We're creating a compassionate digital representation that captures the essence of your photo while respecting its significance.
            </p>
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-red-100 mx-auto mb-8 flex items-center justify-center">
            <i className="fa-solid fa-exclamation-triangle text-red-500 text-3xl"></i>
          </div>
          <h4 className="text-lg font-medium mb-4">Creation Failed</h4>
          <p className="text-neutral-dark/80 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-2.5 bg-lavender text-white rounded-full font-medium hover:bg-lavender-dark transition-all"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ProcessingStep;
