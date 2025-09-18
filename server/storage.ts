import { type User, type InsertUser, type Material, type InsertMaterial, type MaterialSearch } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Material operations
  getMaterial(id: string): Promise<Material | undefined>;
  getMaterials(): Promise<Material[]>;
  searchMaterials(filters: MaterialSearch): Promise<Material[]>;
  getMaterialsBySeller(sellerId: string): Promise<Material[]>;
  createMaterial(material: InsertMaterial, sellerId: string): Promise<Material>;
  updateMaterial(id: string, material: Partial<InsertMaterial>): Promise<Material | undefined>;
  deleteMaterial(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private materials: Map<string, Material>;

  constructor() {
    this.users = new Map();
    this.materials = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
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

export const storage = new MemStorage();
