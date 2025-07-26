import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

export const DATABASE_NAME = "just-for-today.db";

const expoDb = openDatabaseSync(DATABASE_NAME, { useNewConnection: true });

export const drizzleDb = drizzle(expoDb, { schema });
