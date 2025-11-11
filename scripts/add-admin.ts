import { db } from "../server/db";
import { admins } from "@shared/schema";
import bcrypt from "bcryptjs";

async function addAdmin() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.error("Usage: npm run add-admin <username> <password>");
    process.exit(1);
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    await db.insert(admins).values({
      username,
      passwordHash,
    });
    
    console.log(`✅ Admin user '${username}' created successfully!`);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

addAdmin();
