import { db } from "./db";
import { admins, settings } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");
  
  try {
    const existingAdmin = await db.select().from(admins).limit(1);
    
    if (existingAdmin.length === 0) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await db.insert(admins).values({
        username: "admin",
        passwordHash,
      });
      console.log("✅ Admin user created (username: admin, password: admin123)");
    } else {
      console.log("ℹ️  Admin user already exists");
    }
    
    const votingOpenSetting = await db.select().from(settings).where(eq(settings.key, "votingOpen")).limit(1);
    
    if (!votingOpenSetting || votingOpenSetting.length === 0) {
      await db.insert(settings).values({
        key: "votingOpen",
        value: "true",
      });
      console.log("✅ Voting settings initialized (votingOpen: true)");
    } else {
      console.log("ℹ️  Voting settings already exist");
    }
    
    console.log("🎉 Seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

seed();
