import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  rut: text("rut").notNull().unique(),
  correo: text("correo").notNull(),
  telefono: text("telefono").notNull(),
  voteData: text("vote_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
}).extend({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  rut: z.string().regex(/^[0-9]{7,8}-[0-9Kk]$/, "Formato de RUT inválido (ej: 12345678-9)"),
  correo: z.string().email("Correo electrónico inválido"),
  telefono: z.string().regex(/^\+?[0-9]{8,12}$/, "Teléfono inválido (8-12 dígitos)"),
  voteData: z.string().min(1, "Debe incluir datos de votación"),
});

export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;
