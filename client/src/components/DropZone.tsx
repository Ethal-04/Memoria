import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
  selectedFile: File | null;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileSelected, isUploading, selectedFile }) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 50MB",
        variant: "destructive",
      });
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    onFileSelected(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  };

  return (
    <div 
      className={`border-2 border-dashed ${isDragging ? 'border-lavender bg-lavender/5' : 'border-neutral-light'} rounded-xl p-8 text-center mb-8 transition-all`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {previewUrl ? (
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 mb-4 rounded-lg overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover" 
            />
            <button 
              onClick={() => {
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                onFileSelected(new File([], ''));
              }}
              className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-neutral-dark hover:bg-white transition-all"
              disabled={isUploading}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          <p className="text-sm text-green-600 font-medium mb-2">
            <i className="fa-solid fa-check mr-1"></i> Photo selected
          </p>
          <p className="text-neutral-medium text-sm">
            {selectedFile?.name || 'Image file'} ({selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : '0'} MB)
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <i className="fa-solid fa-cloud-arrow-up text-4xl text-lavender mb-4"></i>
            <h4 className="font-poppins font-medium text-lg mb-2">Drag & Drop your photo here</h4>
            <p className="text-neutral-medium">or</p>
          </div>
          <button 
            className="px-6 py-2.5 bg-lavender text-white rounded-full font-medium hover:bg-lavender-dark transition-all"
            onClick={handleBrowseClick}
            disabled={isUploading}
          >
            Browse Files
          </button>
        </>
      )}
      
      <input 
        type="file" 
        id="photo-upload" 
        className="hidden" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={(e) => handleFileSelection(e.target.files)}
        disabled={isUploading}
      />
      
      <p className="mt-4 text-sm text-neutral-medium">Supports JPG, PNG • Max file size 50MB</p>
    </div>
  );
};

export default DropZone;
