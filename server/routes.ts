import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMaterialSchema, materialSearchSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes (handles /api/auth/register, /api/auth/login, /api/auth/logout, /api/user)
  setupAuth(app);

  // Material routes
  app.get("/api/materials", async (req, res) => {
    try {
      const filters = materialSearchSchema.parse(req.query);
      const materials = await storage.searchMaterials(filters);
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/materials/:id", async (req, res) => {
    try {
      const material = await storage.getMaterial(req.params.id);
      if (!material) {
        return res.status(404).json({ message: "Material not found" });
      }
      
      // Get seller information
      const seller = await storage.getUser(material.sellerId);
      res.json({ 
        ...material, 
        seller: seller ? { ...seller, password: undefined } : null 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/materials", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const materialData = insertMaterialSchema.parse(req.body);
      const sellerId = req.user!.id; // Use the authenticated user's ID

      const material = await storage.createMaterial(materialData, sellerId);
      res.json(material);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/materials/:id", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const materialData = insertMaterialSchema.partial().parse(req.body);
      
      // Check if the material exists and belongs to the user
      const existingMaterial = await storage.getMaterial(req.params.id);
      if (!existingMaterial) {
        return res.status(404).json({ message: "Material not found" });
      }
      
      if (existingMaterial.sellerId !== req.user!.id) {
        return res.status(403).json({ message: "You can only edit your own materials" });
      }

      const material = await storage.updateMaterial(req.params.id, materialData);
      res.json(material);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/materials/:id", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Check if the material exists and belongs to the user
      const existingMaterial = await storage.getMaterial(req.params.id);
      if (!existingMaterial) {
        return res.status(404).json({ message: "Material not found" });
      }
      
      if (existingMaterial.sellerId !== req.user!.id) {
        return res.status(403).json({ message: "You can only delete your own materials" });
      }

      const deleted = await storage.deleteMaterial(req.params.id);
      res.json({ message: "Material deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:id/materials", async (req, res) => {
    try {
      const materials = await storage.getMaterialsBySeller(req.params.id);
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
