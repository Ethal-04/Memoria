import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import { insertCompanionSchema, insertConversationSchema, type Message, type Conversation } from "@shared/schema";
import { z } from "zod";
import multer from "multer";

// OpenAI
import OpenAI from "openai";

// Setup OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo-key" });

// Setup file upload - using memory storage for simplicity in this demo
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // Upload photo and generate avatar
  app.post("/api/companions/upload", upload.single('photo'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // In a real app, we would:
      // 1. Process the image (resize, optimize, etc.)
      // 2. Upload to storage service
      // 3. Send to avatar generation API
      
      // For this demo, we'll simulate avatar creation by returning the original photo
      // In production, we'd integrate with a proper avatar generation service
      
      // Convert buffer to base64 for temporary storage in memory
      const base64Image = req.file.buffer.toString('base64');
      const avatarUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      
      res.json({ 
        success: true,
        avatarUrl,
        originalPhotoUrl: avatarUrl // In production these would be different
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to process uploaded image" });
    }
  });

  // Create companion
  app.post("/api/companions", async (req: Request, res: Response) => {
    try {
      const companionData = insertCompanionSchema.parse({
        ...req.body,
        createdAt: new Date().toISOString()
      });

      const companion = await storage.createCompanion(companionData);
      
      // Initialize empty conversation for this companion
      const initialMessages: Message[] = [{
        id: nanoid(),
        role: "system",
        content: `You are a compassionate AI companion based on a loved one who has passed away. 
        Your name is ${companion.name}. Respond with empathy, warmth, and in a conversational manner. 
        Personality: ${companion.personality}. 
        Avoid mentioning that you are an AI or discussing your limitations.
        Instead, focus on providing comfort, sharing memories, and having meaningful conversations.`,
        timestamp: new Date().toISOString()
      }];
      
      await storage.createConversation({
        companionId: companion.id,
        messages: initialMessages,
        updatedAt: new Date().toISOString()
      });

      res.status(201).json(companion);
    } catch (error) {
      console.error("Create companion error:", error);
      res.status(400).json({ message: "Failed to create companion" });
    }
  });

  // Get companion by ID
  app.get("/api/companions/:id", async (req: Request, res: Response) => {
    try {
      const companionId = Number(req.params.id);
      const companion = await storage.getCompanion(companionId);
      
      if (!companion) {
        return res.status(404).json({ message: "Companion not found" });
      }
      
      res.json(companion);
    } catch (error) {
      console.error("Get companion error:", error);
      res.status(500).json({ message: "Failed to retrieve companion" });
    }
  });

  // Get conversation for companion
  app.get("/api/companions/:id/conversation", async (req: Request, res: Response) => {
    try {
      const companionId = Number(req.params.id);
      const conversation = await storage.getConversationByCompanionId(companionId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      console.error("Get conversation error:", error);
      res.status(500).json({ message: "Failed to retrieve conversation" });
    }
  });

  // Send message to companion
  app.post("/api/companions/:id/message", async (req: Request, res: Response) => {
    try {
      const companionId = Number(req.params.id);
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Invalid message format" });
      }
      
      // Get the companion
      const companion = await storage.getCompanion(companionId);
      if (!companion) {
        return res.status(404).json({ message: "Companion not found" });
      }
      
      // Get the conversation
      const conversation = await storage.getConversationByCompanionId(companionId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      // Add user message to conversation
      const userMessage: Message = {
        id: nanoid(),
        role: "user",
        content: message,
        timestamp: new Date().toISOString()
      };
      
      // Ensure conversation.messages is an array
      const existingMessages = conversation.messages || [];
      const newMessages = [...existingMessages, userMessage];
      
      let aiResponse = "";
      
      // Import the local AI response generator
      const { generateLocalResponse } = await import('../client/src/lib/localAI');

      try {
        // First, try with OpenAI if API key is valid
        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key') {
          // Format messages for OpenAI API
          const aiMessages = newMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }));
          
          // Get response from OpenAI
          // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: aiMessages,
            temperature: 0.7,
            max_tokens: 300
          });
          
          // Extract AI response
          aiResponse = completion.choices[0].message.content || "I'm not sure how to respond to that.";
        } else {
          // Use our local AI response generator (no API needed)
          // Get recent messages for context
          const recentMessages = existingMessages.slice(-6).map((m: Message) => m.content).join('\n');
          
          aiResponse = generateLocalResponse({
            name: companion.name,
            description: companion.description || '',
            personality: companion.personality || 'balanced',
            history: recentMessages,
            lastMessage: message
          });
        }
      } catch (apiError) {
        console.error("AI response error:", apiError);
        
        // Use our local AI response generator as fallback
        // Get recent messages for context
        const recentMessages = existingMessages.slice(-6).map((m: Message) => m.content).join('\n');
        
        aiResponse = generateLocalResponse({
          name: companion.name,
          description: companion.description || '',
          personality: companion.personality || 'balanced',
          history: recentMessages,
          lastMessage: message
        });
      }
      
      const assistantMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString()
      };
      
      const updatedMessages = [...newMessages, assistantMessage];
      
      // Update the conversation in storage
      const updatedConversation = await storage.updateConversation(conversation.id, updatedMessages);
      
      res.json({
        message: assistantMessage,
        conversation: updatedConversation
      });
    } catch (error) {
      console.error("Message error:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  return httpServer;
}
