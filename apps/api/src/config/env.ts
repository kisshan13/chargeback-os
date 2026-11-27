import { config as loadDotenv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

// The renderer builds and runs the whole app from one repository-root env file.
const repositoryEnvPath = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../.env");
loadDotenv({ path: repositoryEnvPath });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_BASE_URL: z.string().url().optional(),
  MOZAIK_MODEL: z.string().min(1).default("gpt-6-luna"),
  SYNTHETIC_DATA_DIR: z.string().min(1).optional()
});

export const env = envSchema.parse(process.env);

export const corsOrigins = env.CORS_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export type Env = z.infer<typeof envSchema>;
