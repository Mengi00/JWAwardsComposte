import bcrypt from "bcryptjs";

const password = process.argv[2] || "wnd2025";
const hash = bcrypt.hashSync(password, 10);

console.log(`Password: ${password}`);
console.log(`Hash: ${hash}`);
console.log(`\nSQL Command:`);
console.log(`INSERT INTO admins (username, "passwordHash") VALUES ('superadmin', '${hash}');`);
