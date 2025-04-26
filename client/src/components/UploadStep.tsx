import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DropZone from "./DropZone";
import { uploadPhoto } from "@/lib/openai";

interface UploadStepProps {
  onImageUploaded: (avatarUrl: string, originalPhotoUrl: string) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ onImageUploaded }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleContinue = async () => {
    if (!file) {
      toast({
        title: "No photo selected",
        description: "Please select a photo to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const result = await uploadPhoto(file);
      
      if (result.success) {
        onImageUploaded(result.avatarUrl, result.originalPhotoUrl);
      } else {
        throw new Error("Failed to process the photo");
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h3 className="font-poppins text-xl font-medium mb-6">Upload a Clear Photo</h3>
      <p className="mb-6 text-neutral-dark/80">Choose a high-quality photo that clearly shows your loved one's face. Preferably a front-facing image with good lighting.</p>
      
      <DropZone 
        onFileSelected={handleFileSelected} 
        isUploading={isUploading}
        selectedFile={file}
      />
      
      <div className="bg-blue/10 rounded-lg p-4 flex items-start mb-8">
        <i className="fa-solid fa-circle-info text-blue mt-1 mr-3"></i>
        <p className="text-sm text-neutral-dark/90">
          All photos are processed securely and privately. We do not store or share your original photos. They are only used to create your memory companion.
        </p>
      </div>
      
      <div className="flex justify-between">
        <button 
          className="px-6 py-2.5 text-neutral-medium bg-neutral-light rounded-full font-medium opacity-50 cursor-not-allowed"
          disabled={true}
        >
          Back
        </button>
        <button 
          className={`px-8 py-2.5 bg-gradient-to-r from-lavender to-teal text-white rounded-full font-medium ${!file || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-medium transition-all'}`}
          onClick={handleContinue}
          disabled={!file || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default UploadStep;
