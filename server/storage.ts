import { 
  votes, admins, settings, categories, djs, djCategories,
  type Vote, type InsertVote,
  type Admin, type InsertAdmin,
  type Setting, type InsertSetting,
  type Category, type InsertCategory,
  type Dj, type InsertDj,
  type DjCategory, type InsertDjCategory
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface CategoryStats {
  [categoryId: string]: {
    [artistId: string]: number;
  };
}

export interface IStorage {
  createVote(vote: InsertVote): Promise<Vote>;
  getVoteByRut(rut: string): Promise<Vote | undefined>;
  getAllVotes(): Promise<Vote[]>;
  getVotesPaginated(page: number, limit: number): Promise<{ votes: Vote[], total: number }>;
  getStats(): Promise<CategoryStats>;
  
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  
  getSetting(key: string): Promise<Setting | undefined>;
  upsertSetting(key: string, value: string): Promise<Setting>;
  
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  
  getAllDjs(): Promise<Dj[]>;
  getDjById(id: string): Promise<Dj | undefined>;
  createDj(dj: InsertDj): Promise<Dj>;
  updateDj(id: string, dj: Partial<InsertDj>): Promise<Dj>;
  deleteDj(id: string): Promise<void>;
  
  getDjsByCategory(categoryId: string): Promise<Dj[]>;
  assignDjToCategory(djId: string, categoryId: string): Promise<DjCategory>;
  removeDjFromCategory(djId: string, categoryId: string): Promise<void>;
  getDjCategoryAssignments(): Promise<DjCategory[]>;
}

export class DatabaseStorage implements IStorage {
  async createVote(insertVote: InsertVote): Promise<Vote> {
    const existing = await this.getVoteByRut(insertVote.rut);
    
    if (existing) {
      throw new Error("Ya existe un voto registrado con este RUT");
    }

    const [vote] = await db
      .insert(votes)
      .values(insertVote)
      .returning();
    return vote;
  }

  async getVoteByRut(rut: string): Promise<Vote | undefined> {
    const [vote] = await db.select().from(votes).where(eq(votes.rut, rut));
    return vote || undefined;
  }

  async getAllVotes(): Promise<Vote[]> {
    return await db.select().from(votes).orderBy(desc(votes.createdAt));
  }

  async getVotesPaginated(page: number, limit: number): Promise<{ votes: Vote[], total: number }> {
    const offset = (page - 1) * limit;
    const [totalResult] = await db.select({ count: sql<number>`count(*)::int` }).from(votes);
    const total = totalResult.count;
    const votesList = await db.select().from(votes).orderBy(desc(votes.createdAt)).limit(limit).offset(offset);
    return { votes: votesList, total };
  }

  async getStats(): Promise<CategoryStats> {
    const allVotes = await this.getAllVotes();
    const stats: CategoryStats = {};

    for (const vote of allVotes) {
      try {
        const voteData = JSON.parse(vote.voteData);
        
        for (const [categoryId, artistId] of Object.entries(voteData)) {
          if (!stats[categoryId]) {
            stats[categoryId] = {};
          }
          
          const artistIdStr = artistId as string;
          stats[categoryId][artistIdStr] = (stats[categoryId][artistIdStr] || 0) + 1;
        }
      } catch (error) {
        console.error("Error parsing vote data:", error);
      }
    }

    return stats;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db.insert(admins).values(insertAdmin).returning();
    return admin;
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || undefined;
  }

  async upsertSetting(key: string, value: string): Promise<Setting> {
    const existing = await this.getSetting(key);
    if (existing) {
      const [updated] = await db
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.key, key))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(settings).values({ key, value }).returning();
      return created;
    }
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.order);
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: string, updateData: Partial<InsertCategory>): Promise<Category> {
    const [category] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getAllDjs(): Promise<Dj[]> {
    return await db.select().from(djs).orderBy(djs.name);
  }

  async getDjById(id: string): Promise<Dj | undefined> {
    const [dj] = await db.select().from(djs).where(eq(djs.id, id));
    return dj || undefined;
  }

  async createDj(insertDj: InsertDj): Promise<Dj> {
    const [dj] = await db.insert(djs).values(insertDj).returning();
    return dj;
  }

  async updateDj(id: string, updateData: Partial<InsertDj>): Promise<Dj> {
    const [dj] = await db
      .update(djs)
      .set(updateData)
      .where(eq(djs.id, id))
      .returning();
    return dj;
  }

  async deleteDj(id: string): Promise<void> {
    await db.delete(djs).where(eq(djs.id, id));
  }

  async getDjsByCategory(categoryId: string): Promise<Dj[]> {
    const result = await db
      .select({ dj: djs })
      .from(djCategories)
      .innerJoin(djs, eq(djCategories.djId, djs.id))
      .where(eq(djCategories.categoryId, categoryId));
    return result.map(r => r.dj);
  }

  async assignDjToCategory(djId: string, categoryId: string): Promise<DjCategory> {
    const [assignment] = await db
      .insert(djCategories)
      .values({ djId, categoryId })
      .returning();
    return assignment;
  }

  async removeDjFromCategory(djId: string, categoryId: string): Promise<void> {
    await db
      .delete(djCategories)
      .where(sql`${djCategories.djId} = ${djId} AND ${djCategories.categoryId} = ${categoryId}`);
  }

  async getDjCategoryAssignments(): Promise<DjCategory[]> {
    return await db.select().from(djCategories);
  }
}

export const storage = new DatabaseStorage();
