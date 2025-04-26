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
  
  // Session store for authentication
  sessionStore: any;
}

import createMemoryStore from "memorystore";
const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  sessionStore: any;
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
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });
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

import session from "express-session";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCompanion(id: number): Promise<Companion | undefined> {
    const [companion] = await db.select().from(companions).where(eq(companions.id, id));
    return companion || undefined;
  }

  async getCompanionsByUserId(userId: number): Promise<Companion[]> {
    return await db.select().from(companions).where(eq(companions.userId, userId));
  }

  async createCompanion(insertCompanion: InsertCompanion): Promise<Companion> {
    const [companion] = await db
      .insert(companions)
      .values(insertCompanion)
      .returning();
    return companion;
  }

  async updateCompanion(id: number, data: Partial<Companion>): Promise<Companion | undefined> {
    const [companion] = await db
      .update(companions)
      .set(data)
      .where(eq(companions.id, id))
      .returning();
    return companion || undefined;
  }

  async deleteCompanion(id: number): Promise<boolean> {
    const result = await db
      .delete(companions)
      .where(eq(companions.id, id));
    return true;  // In PostgreSQL with Drizzle, success doesn't return count
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async getConversationByCompanionId(companionId: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.companionId, companionId));
    return conversation || undefined;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values(insertConversation)
      .returning();
    return conversation;
  }

  async updateConversation(id: number, messages: Message[]): Promise<Conversation | undefined> {
    const [conversation] = await db
      .update(conversations)
      .set({ 
        messages: JSON.stringify(messages),
        updatedAt: new Date().toISOString()
      })
      .where(eq(conversations.id, id))
      .returning();
    return conversation || undefined;
  }
}

// Switch from MemStorage to DatabaseStorage for persistence
export const storage = new DatabaseStorage();
