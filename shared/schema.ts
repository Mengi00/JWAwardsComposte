import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
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

export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const djs = pgTable("djs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  photo: text("photo"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDjSchema = createInsertSchema(djs).omit({
  id: true,
  createdAt: true,
});

export type InsertDj = z.infer<typeof insertDjSchema>;
export type Dj = typeof djs.$inferSelect;

export const djCategories = pgTable("dj_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  djId: varchar("dj_id").notNull().references(() => djs.id, { onDelete: "cascade" }),
  categoryId: varchar("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDjCategorySchema = createInsertSchema(djCategories).omit({
  id: true,
  createdAt: true,
});

export type InsertDjCategory = z.infer<typeof insertDjCategorySchema>;
export type DjCategory = typeof djCategories.$inferSelect;
