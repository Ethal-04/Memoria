import {
  users,
  companions,
  conversations,
  type User,
  type InsertUser,
  type Companion,
  type InsertCompanion,
  type Conversation,
  type InsertConversation,
  type Message
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Companions
  getCompanion(id: number): Promise<Companion | undefined>;
  getCompanionsByUserId(userId: number): Promise<Companion[]>;
  createCompanion(companion: InsertCompanion): Promise<Companion>;
  updateCompanion(id: number, data: Partial<Companion>): Promise<Companion | undefined>;
  deleteCompanion(id: number): Promise<boolean>;
  
  // Conversations
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationByCompanionId(companionId: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, messages: Message[]): Promise<Conversation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companions: Map<number, Companion>;
  private conversations: Map<number, Conversation>;
  private userId: number;
  private companionId: number;
  private conversationId: number;

  constructor() {
    this.users = new Map();
    this.companions = new Map();
    this.conversations = new Map();
    this.userId = 1;
    this.companionId = 1;
    this.conversationId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Companion methods
  async getCompanion(id: number): Promise<Companion | undefined> {
    return this.companions.get(id);
  }

  async getCompanionsByUserId(userId: number): Promise<Companion[]> {
    return Array.from(this.companions.values()).filter(
      (companion) => companion.userId === userId,
    );
  }

  async createCompanion(insertCompanion: InsertCompanion): Promise<Companion> {
    const id = this.companionId++;
    const companion: Companion = { ...insertCompanion, id };
    this.companions.set(id, companion);
    return companion;
  }

  async updateCompanion(id: number, data: Partial<Companion>): Promise<Companion | undefined> {
    const companion = this.companions.get(id);
    if (!companion) return undefined;
    
    const updatedCompanion: Companion = { ...companion, ...data };
    this.companions.set(id, updatedCompanion);
    return updatedCompanion;
  }

  async deleteCompanion(id: number): Promise<boolean> {
    return this.companions.delete(id);
  }

  // Conversation methods
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getConversationByCompanionId(companionId: number): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(
      (conversation) => conversation.companionId === companionId,
    );
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationId++;
    const conversation: Conversation = { ...insertConversation, id };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: number, messages: Message[]): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const updatedConversation: Conversation = { 
      ...conversation, 
      messages, 
      updatedAt: new Date().toISOString() 
    };
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
}

export const storage = new MemStorage();
