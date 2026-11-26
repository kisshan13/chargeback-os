import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGINS: z.string().default("http://localhost:3001"),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_BASE_URL: z.string().url().optional(),
  MOZAIK_MODEL: z.string().min(1).default("gpt-5.5"),
  SYNTHETIC_DATA_DIR: z.string().min(1).optional()
});

export const env = envSchema.parse(process.env);

export const corsOrigins = env.CORS_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export type Env = z.infer<typeof envSchema>;
