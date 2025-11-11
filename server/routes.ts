import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertVoteSchema, 
  insertCategorySchema, 
  insertDjSchema,
  insertDjCategorySchema 
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { requireAuth } from "./middleware/auth";
import bcrypt from "bcryptjs";
import * as XLSX from "xlsx";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Usuario y contraseña requeridos" });
      }
      
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
      
      const validPassword = await bcrypt.compare(password, admin.passwordHash);
      
      if (!validPassword) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
      
      req.session.adminId = admin.id;
      res.json({ 
        success: true, 
        admin: { id: admin.id, username: admin.username } 
      });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Error al cerrar sesión" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      res.json({ authenticated: true, adminId: req.session.adminId });
    } catch (error) {
      res.status(500).json({ error: "Error al verificar sesión" });
    }
  });

  app.get("/api/settings", async (req, res) => {
    try {
      const votingOpenSetting = await storage.getSetting("votingOpen");
      const votingOpen = votingOpenSetting ? votingOpenSetting.value === "true" : true;
      res.json({ votingOpen });
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Error al obtener configuración" });
    }
  });

  app.put("/api/admin/settings", requireAuth, async (req, res) => {
    try {
      const { votingOpen } = req.body;
      const setting = await storage.upsertSetting("votingOpen", String(votingOpen));
      res.json({ votingOpen: setting.value === "true" });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: "Error al actualizar configuración" });
    }
  });

  app.get("/api/admin/categories", requireAuth, async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Error al obtener categorías" });
    }
  });

  app.post("/api/admin/categories", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          error: "Datos inválidos", 
          details: validationError.message 
        });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Error al crear categoría" });
    }
  });

  app.put("/api/admin/categories/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.updateCategory(id, req.body);
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Error al actualizar categoría" });
    }
  });

  app.delete("/api/admin/categories/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCategory(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Error al eliminar categoría" });
    }
  });

  app.get("/api/admin/djs", requireAuth, async (req, res) => {
    try {
      const djsList = await storage.getAllDjs();
      res.json(djsList);
    } catch (error) {
      console.error("Error fetching DJs:", error);
      res.status(500).json({ error: "Error al obtener DJs" });
    }
  });

  app.post("/api/admin/djs", requireAuth, async (req, res) => {
    try {
      const validatedData = insertDjSchema.parse(req.body);
      const dj = await storage.createDj(validatedData);
      res.status(201).json(dj);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          error: "Datos inválidos", 
          details: validationError.message 
        });
      }
      console.error("Error creating DJ:", error);
      res.status(500).json({ error: "Error al crear DJ" });
    }
  });

  app.put("/api/admin/djs/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const dj = await storage.updateDj(id, req.body);
      res.json(dj);
    } catch (error) {
      console.error("Error updating DJ:", error);
      res.status(500).json({ error: "Error al actualizar DJ" });
    }
  });

  app.delete("/api/admin/djs/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteDj(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting DJ:", error);
      res.status(500).json({ error: "Error al eliminar DJ" });
    }
  });

  app.get("/api/dj-categories", async (req, res) => {
    try {
      const assignments = await storage.getDjCategoryAssignments();
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching DJ categories:", error);
      res.status(500).json({ error: "Error al obtener asignaciones" });
    }
  });

  app.get("/api/admin/dj-categories", requireAuth, async (req, res) => {
    try {
      const assignments = await storage.getDjCategoryAssignments();
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching DJ categories:", error);
      res.status(500).json({ error: "Error al obtener asignaciones" });
    }
  });

  app.post("/api/admin/dj-categories", requireAuth, async (req, res) => {
    try {
      const validatedData = insertDjCategorySchema.parse(req.body);
      const assignment = await storage.assignDjToCategory(validatedData.djId, validatedData.categoryId);
      res.status(201).json(assignment);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          error: "Datos inválidos", 
          details: validationError.message 
        });
      }
      console.error("Error assigning DJ to category:", error);
      res.status(500).json({ error: "Error al asignar DJ a categoría" });
    }
  });

  app.delete("/api/admin/dj-categories", requireAuth, async (req, res) => {
    try {
      const { djId, categoryId } = req.body;
      await storage.removeDjFromCategory(djId, categoryId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing DJ from category:", error);
      res.status(500).json({ error: "Error al remover DJ de categoría" });
    }
  });

  app.get("/api/admin/voters", requireAuth, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { votes, total } = await storage.getVotesPaginated(page, limit);
      res.json({ votes, total, page, limit, pages: Math.ceil(total / limit) });
    } catch (error) {
      console.error("Error fetching voters:", error);
      res.status(500).json({ error: "Error al obtener votantes" });
    }
  });

  app.get("/api/admin/voters/export", requireAuth, async (req, res) => {
    try {
      const allVotes = await storage.getAllVotes();
      
      const data = allVotes.map(vote => ({
        Nombre: vote.nombre,
        RUT: vote.rut,
        Correo: vote.correo,
        Teléfono: vote.telefono,
        Fecha: vote.createdAt.toISOString(),
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Votantes");
      
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-Disposition', 'attachment; filename=votantes.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting voters:", error);
      res.status(500).json({ error: "Error al exportar votantes" });
    }
  });

  app.post("/api/votes", async (req, res) => {
    try {
      const votingOpenSetting = await storage.getSetting("votingOpen");
      const votingOpen = votingOpenSetting ? votingOpenSetting.value === "true" : true;
      
      if (!votingOpen) {
        return res.status(403).json({ error: "Las votaciones están cerradas" });
      }
      
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

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Error al obtener categorías" });
    }
  });

  app.get("/api/djs", async (req, res) => {
    try {
      const djsList = await storage.getAllDjs();
      res.json(djsList);
    } catch (error) {
      console.error("Error fetching DJs:", error);
      res.status(500).json({ error: "Error al obtener DJs" });
    }
  });

  app.get("/api/djs/category/:categoryId", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const djsList = await storage.getDjsByCategory(categoryId);
      res.json(djsList);
    } catch (error) {
      console.error("Error fetching DJs by category:", error);
      res.status(500).json({ error: "Error al obtener DJs por categoría" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
