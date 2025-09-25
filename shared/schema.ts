import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dataSources = pgTable("data_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'mysql', 'postgresql', 'mongodb', 's3', 'csv', etc.
  connectionConfig: jsonb("connection_config").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const datasets = pgTable("datasets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sourceId: varchar("source_id").references(() => dataSources.id),
  schema: jsonb("schema"), // Column definitions and types
  rowCount: integer("row_count").default(0),
  fileSize: integer("file_size"), // in bytes
  status: text("status").default("uploaded"), // 'uploaded', 'processed', 'error'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cleansingRules = pgTable("cleansing_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'trim', 'case_normalize', 'regex_replace', 'date_parse'
  config: jsonb("config").notNull(), // Rule-specific configuration
  targetColumns: jsonb("target_columns").notNull(), // Array of column names
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deduplicationRules = pgTable("deduplication_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  matchType: text("match_type").notNull(), // 'exact', 'fuzzy'
  blockingKeys: jsonb("blocking_keys").notNull(), // Array of column names for blocking
  similarityThreshold: real("similarity_threshold").default(0.8),
  config: jsonb("config").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'cleanse', 'dedupe', 'import', 'export'
  datasetId: varchar("dataset_id").references(() => datasets.id),
  status: text("status").default("queued"), // 'queued', 'running', 'completed', 'failed'
  progress: integer("progress").default(0), // 0-100
  recordsProcessed: integer("records_processed").default(0),
  recordsTotal: integer("records_total").default(0),
  config: jsonb("config"), // Job-specific configuration
  logs: jsonb("logs"), // Array of log entries
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertDataSourceSchema = createInsertSchema(dataSources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDatasetSchema = createInsertSchema(datasets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCleansingRuleSchema = createInsertSchema(cleansingRules).omit({
  id: true,
  createdAt: true,
});

export const insertDeduplicationRuleSchema = createInsertSchema(deduplicationRules).omit({
  id: true,
  createdAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  startedAt: true,
  completedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type DataSource = typeof dataSources.$inferSelect;
export type InsertDataSource = z.infer<typeof insertDataSourceSchema>;
export type Dataset = typeof datasets.$inferSelect;
export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type CleansingRule = typeof cleansingRules.$inferSelect;
export type InsertCleansingRule = z.infer<typeof insertCleansingRuleSchema>;
export type DeduplicationRule = typeof deduplicationRules.$inferSelect;
export type InsertDeduplicationRule = z.infer<typeof insertDeduplicationRuleSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
