import { type User, type InsertUser, type Material, type InsertMaterial, type MaterialSearch, users, materials } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Material operations
  getMaterial(id: string): Promise<Material | undefined>;
  getMaterials(): Promise<Material[]>;
  searchMaterials(filters: MaterialSearch): Promise<Material[]>;
  getMaterialsBySeller(sellerId: string): Promise<Material[]>;
  createMaterial(material: InsertMaterial, sellerId: string): Promise<Material>;
  updateMaterial(id: string, material: Partial<InsertMaterial>): Promise<Material | undefined>;
  deleteMaterial(id: string): Promise<boolean>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

// Database storage implementation using PostgreSQL
export class DatabaseStorage implements IStorage {
  private db: any;
  public sessionStore: session.Store;

  constructor() {
    const sql = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql);
    
    // Create session store using the same database connection
    this.sessionStore = new PostgresSessionStore({
      conString: process.env.DATABASE_URL!,
      createTableIfMissing: true,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getMaterial(id: string): Promise<Material | undefined> {
    const result = await this.db.select().from(materials).where(eq(materials.id, id)).limit(1);
    return result[0];
  }

  async getMaterials(): Promise<Material[]> {
    const result = await this.db.select().from(materials).where(eq(materials.isAvailable, true));
    return result.sort((a: Material, b: Material) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async searchMaterials(filters: MaterialSearch): Promise<Material[]> {
    let query = this.db.select().from(materials).where(eq(materials.isAvailable, true));
    
    // For now, return all materials - can enhance with proper filtering later
    const result = await query;
    let filteredMaterials = result;

    if (filters.query) {
      const searchQuery = filters.query.toLowerCase();
      filteredMaterials = filteredMaterials.filter((material: Material) => 
        material.title.toLowerCase().includes(searchQuery) ||
        material.description.toLowerCase().includes(searchQuery)
      );
    }

    if (filters.category) {
      filteredMaterials = filteredMaterials.filter((material: Material) => 
        material.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters.location) {
      filteredMaterials = filteredMaterials.filter((material: Material) => 
        material.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.condition) {
      filteredMaterials = filteredMaterials.filter((material: Material) => 
        material.condition.toLowerCase() === filters.condition!.toLowerCase()
      );
    }

    return filteredMaterials.sort((a: Material, b: Material) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getMaterialsBySeller(sellerId: string): Promise<Material[]> {
    const result = await this.db.select().from(materials).where(eq(materials.sellerId, sellerId));
    return result.sort((a: Material, b: Material) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createMaterial(insertMaterial: InsertMaterial, sellerId: string): Promise<Material> {
    const materialData = {
      ...insertMaterial,
      sellerId,
      price: insertMaterial.price || null,
      images: insertMaterial.images || [],
      isAvailable: true,
    };
    const result = await this.db.insert(materials).values(materialData).returning();
    return result[0];
  }

  async updateMaterial(id: string, updateData: Partial<InsertMaterial>): Promise<Material | undefined> {
    const result = await this.db.update(materials).set(updateData).where(eq(materials.id, id)).returning();
    return result[0];
  }

  async deleteMaterial(id: string): Promise<boolean> {
    const result = await this.db.delete(materials).where(eq(materials.id, id));
    return result.rowCount > 0;
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private materials: Map<string, Material>;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.materials = new Map();
    
    // Create in-memory session store
    const MemoryStore = require("memorystore")(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      phone: insertUser.phone || null,
      location: insertUser.location || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getMaterial(id: string): Promise<Material | undefined> {
    return this.materials.get(id);
  }

  async getMaterials(): Promise<Material[]> {
    return Array.from(this.materials.values())
      .filter(material => material.isAvailable)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async searchMaterials(filters: MaterialSearch): Promise<Material[]> {
    let materials = Array.from(this.materials.values())
      .filter(material => material.isAvailable);

    if (filters.query) {
      const query = filters.query.toLowerCase();
      materials = materials.filter(material => 
        material.title.toLowerCase().includes(query) ||
        material.description.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      materials = materials.filter(material => 
        material.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters.location) {
      materials = materials.filter(material => 
        material.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.condition) {
      materials = materials.filter(material => 
        material.condition.toLowerCase() === filters.condition!.toLowerCase()
      );
    }

    return materials.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getMaterialsBySeller(sellerId: string): Promise<Material[]> {
    return Array.from(this.materials.values())
      .filter(material => material.sellerId === sellerId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createMaterial(insertMaterial: InsertMaterial, sellerId: string): Promise<Material> {
    const id = randomUUID();
    const material: Material = {
      ...insertMaterial,
      id,
      sellerId,
      price: insertMaterial.price || null,
      images: insertMaterial.images || [],
      isAvailable: true,
      createdAt: new Date(),
    };
    this.materials.set(id, material);
    return material;
  }

  async updateMaterial(id: string, updateData: Partial<InsertMaterial>): Promise<Material | undefined> {
    const material = this.materials.get(id);
    if (!material) return undefined;

    const updatedMaterial = { ...material, ...updateData };
    this.materials.set(id, updatedMaterial);
    return updatedMaterial;
  }

  async deleteMaterial(id: string): Promise<boolean> {
    return this.materials.delete(id);
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
