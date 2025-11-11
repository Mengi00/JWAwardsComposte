import { votes, type Vote, type InsertVote } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface CategoryStats {
  [categoryId: string]: {
    [artistId: string]: number;
  };
}

export interface IStorage {
  createVote(vote: InsertVote): Promise<Vote>;
  getVoteByRut(rut: string): Promise<Vote | undefined>;
  getAllVotes(): Promise<Vote[]>;
  getStats(): Promise<CategoryStats>;
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
    return await db.select().from(votes);
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
}

export const storage = new DatabaseStorage();
