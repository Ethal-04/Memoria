import { apiRequest } from "./queryClient";

export interface UploadPhotoResponse {
  success: boolean;
  avatarUrl: string;
  originalPhotoUrl: string;
}

export interface CompanionData {
  id?: number;
  userId?: number;
  name: string;
  description: string;
  avatarUrl: string;
  originalPhotoUrl: string;
  personality: string;
  voiceType: string;
}

export interface MessageData {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ConversationData {
  id: number;
  companionId: number;
  messages: MessageData[];
  updatedAt: string;
}

export interface MessageResponse {
  message: MessageData;
  conversation: ConversationData;
}

export const uploadPhoto = async (file: File): Promise<UploadPhotoResponse> => {
  const formData = new FormData();
  formData.append("photo", file);
  
  // Using fetch directly as react-query's default fetcher doesn't handle FormData well
  const response = await fetch("/api/companions/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to upload photo");
  }
  
  return response.json();
};

export const createCompanion = async (data: CompanionData): Promise<CompanionData> => {
  const response = await apiRequest("POST", "/api/companions", data);
  return response.json();
};

export const getCompanion = async (id: number): Promise<CompanionData> => {
  const response = await apiRequest("GET", `/api/companions/${id}`);
  return response.json();
};

export const getConversation = async (companionId: number): Promise<ConversationData> => {
  const response = await apiRequest("GET", `/api/companions/${companionId}/conversation`);
  return response.json();
};

export const sendMessage = async (companionId: number, message: string): Promise<MessageResponse> => {
  const response = await apiRequest("POST", `/api/companions/${companionId}/message`, { message });
  return response.json();
};

// Speech synthesis
export const speakText = (text: string, voiceType: string = "natural"): void => {
  if (!window.speechSynthesis) {
    console.error("Speech synthesis not supported");
    return;
  }

  // Cancel any existing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Get available voices
  const voices = window.speechSynthesis.getVoices();
  
  // Select a voice based on voiceType preference
  // This is a simplified approach - in production we would map voiceType to specific voices
  if (voices.length > 0) {
    // For "natural", choose a more neutral voice
    if (voiceType === "natural") {
      utterance.voice = voices.find(voice => voice.name.includes("Male") || voice.name.includes("Female")) || null;
    } 
    // For other types, we could have more specific mappings
    else {
      utterance.voice = voices[0];
    }
  }
  
  utterance.rate = 0.9; // Slightly slower for more natural conversation
  utterance.pitch = 1.0;
  
  window.speechSynthesis.speak(utterance);
};
