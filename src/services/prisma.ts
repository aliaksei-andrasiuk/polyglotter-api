import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectDB = async () => {
    try {
      await prisma.$connect();
      console.log("✅ Connected to PostgreSQL");
    } catch (error) {
      console.error("❌ Database connection error:", error);
      process.exit(1);
    }
  };

  export const disconnectDB = async () => {
    try {
      await prisma.$disconnect();
      console.log("🔌 Disconnected from PostgreSQL");
    } catch (error) {
      console.error("❌ Error disconnecting:", error);
    }
  };

