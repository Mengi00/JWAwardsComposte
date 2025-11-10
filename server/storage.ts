import { votes, type Vote, type InsertVote } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createVote(vote: InsertVote): Promise<Vote>;
  getVoteByRut(rut: string): Promise<Vote | undefined>;
  getAllVotes(): Promise<Vote[]>;
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
}

export const storage = new DatabaseStorage();
