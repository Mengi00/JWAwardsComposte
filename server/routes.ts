import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVoteSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/votes", async (req, res) => {
    try {
      const validatedData = insertVoteSchema.parse(req.body);
      const vote = await storage.createVote(validatedData);
      res.status(201).json(vote);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          error: "Datos inválidos", 
          details: validationError.message 
        });
      }
      
      if (error.message === "Ya existe un voto registrado con este RUT") {
        return res.status(409).json({ error: error.message });
      }
      
      console.error("Error creating vote:", error);
      res.status(500).json({ error: "Error al registrar el voto" });
    }
  });

  app.get("/api/votes/check/:rut", async (req, res) => {
    try {
      const { rut } = req.params;
      const vote = await storage.getVoteByRut(rut);
      res.json({ exists: !!vote });
    } catch (error) {
      console.error("Error checking vote:", error);
      res.status(500).json({ error: "Error al verificar el voto" });
    }
  });

  app.get("/api/votes", async (req, res) => {
    try {
      const votes = await storage.getAllVotes();
      res.json(votes);
    } catch (error) {
      console.error("Error fetching votes:", error);
      res.status(500).json({ error: "Error al obtener votos" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Error al obtener estadísticas" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
