import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "trialing",
  "active",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "past_due",
  "paused",
  "unpaid",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "resume",
  "cover_letter",
  "linkedin_summary",
  "executive_bio",
  "other",
]);

export const generationStatusEnum = pgEnum("generation_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "saved",
  "applied",
  "interviewing",
  "offered",
  "rejected",
  "withdrawn",
]);

// ---------------------------------------------------------------------------
// Users & Core
// ---------------------------------------------------------------------------

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // Clerk User ID
    name: text("name"),
    email: text("email").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
    // Stripe
    stripeCustomerId: text("stripe_customer_id"),
    // Credits / usage
    creditsRemaining: integer("credits_remaining").notNull().default(5),
    creditsTotal: integer("credits_total").notNull().default(5),
  },
  (t) => [
    uniqueIndex("users_email_idx").on(t.email),
    index("users_stripe_customer_id_idx").on(t.stripeCustomerId),
  ]
);

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeSubscriptionId: text("stripe_subscription_id").notNull(),
    stripePriceId: text("stripe_price_id").notNull(),
    stripeProductId: text("stripe_product_id"),
    status: subscriptionStatusEnum("status").notNull(),
    currentPeriodStart: timestamp("current_period_start", {
      mode: "date",
    }),
    currentPeriodEnd: timestamp("current_period_end", {
      mode: "date",
    }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    canceledAt: timestamp("canceled_at", { mode: "date" }),
    trialStart: timestamp("trial_start", { mode: "date" }),
    trialEnd: timestamp("trial_end", { mode: "date" }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    index("subscriptions_user_id_idx").on(t.userId),
    uniqueIndex("subscriptions_user_id_unique_idx").on(t.userId),
    uniqueIndex("subscriptions_stripe_id_idx").on(t.stripeSubscriptionId),
  ]
);

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    type: documentTypeEnum("type").notNull(),
    content: text("content"),
    // Raw inputs used to generate this document
    jobTitle: text("job_title"),
    jobDescription: text("job_description"),
    companyName: text("company_name"),
    tone: text("tone"),
    targetRole: text("target_role"),
    yearsOfExperience: integer("years_of_experience"),
    // Generation metadata
    generationStatus: generationStatusEnum("generation_status")
      .notNull()
      .default("pending"),
    model: text("model"),
    promptTokens: integer("prompt_tokens"),
    completionTokens: integer("completion_tokens"),
    // Versioning
    version: integer("version").notNull().default(1),
    parentDocumentId: uuid("parent_document_id"),
    // Extra flexible data
    metadata: jsonb("metadata"),
    // Timestamps
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (t) => [
    index("documents_user_id_idx").on(t.userId),
    index("documents_type_idx").on(t.type),
    index("documents_created_at_idx").on(t.createdAt),
    index("documents_parent_idx").on(t.parentDocumentId),
  ]
);

// ---------------------------------------------------------------------------
// User profiles (extended career info)
// ---------------------------------------------------------------------------

export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    headline: text("headline"),
    summary: text("summary"),
    targetRole: text("target_role"),
    targetIndustry: text("target_industry"),
    yearsOfExperience: integer("years_of_experience"),
    currentCompany: text("current_company"),
    currentTitle: text("current_title"),
    linkedinUrl: text("linkedin_url"),
    websiteUrl: text("website_url"),
    location: text("location"),
    skills: jsonb("skills").$type<string[]>(),
    education: jsonb("education"),
    experience: jsonb("experience"),
    achievements: jsonb("achievements"),
    rawResumeText: text("raw_resume_text"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("user_profiles_user_id_idx").on(t.userId)]
);

// ---------------------------------------------------------------------------
// Generation jobs (for Inngest async tracking)
// ---------------------------------------------------------------------------

export const generationJobs = pgTable(
  "generation_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    documentId: uuid("document_id").references(() => documents.id, {
      onDelete: "set null",
    }),
    inngestEventId: text("inngest_event_id"),
    inngestRunId: text("inngest_run_id"),
    status: generationStatusEnum("status").notNull().default("pending"),
    type: documentTypeEnum("type").notNull(),
    input: jsonb("input"),
    error: text("error"),
    startedAt: timestamp("started_at", { mode: "date" }),
    completedAt: timestamp("completed_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    index("generation_jobs_user_id_idx").on(t.userId),
    index("generation_jobs_document_id_idx").on(t.documentId),
    index("generation_jobs_status_idx").on(t.status),
  ]
);

// ---------------------------------------------------------------------------
// Payments / invoices (for audit trail)
// ---------------------------------------------------------------------------

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    stripeInvoiceId: text("stripe_invoice_id"),
    amount: integer("amount").notNull(), // in cents
    currency: text("currency").notNull().default("usd"),
    status: text("status").notNull(),
    description: text("description"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    index("payments_user_id_idx").on(t.userId),
    index("payments_stripe_invoice_id_idx").on(t.stripeInvoiceId),
  ]
);

// ---------------------------------------------------------------------------
// Job Applications (Tracker)
// ---------------------------------------------------------------------------

export const jobApplications = pgTable(
  "job_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    documentId: uuid("document_id").references(() => documents.id, {
      onDelete: "set null",
    }),
    companyName: text("company_name").notNull(),
    jobTitle: text("job_title").notNull(),
    status: applicationStatusEnum("status").notNull().default("saved"),
    location: text("location"),
    salary: text("salary"),
    url: text("url"),
    notes: text("notes"),
    appliedAt: timestamp("applied_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    index("job_applications_user_id_idx").on(t.userId),
    index("job_applications_status_idx").on(t.status),
  ]
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
  documents: many(documents),
  generationJobs: many(generationJobs),
  payments: many(payments),
  jobApplications: many(jobApplications),
}));



export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  user: one(users, { fields: [documents.userId], references: [users.id] }),
  generationJobs: many(generationJobs),
  parent: one(documents, {
    fields: [documents.parentDocumentId],
    references: [documents.id],
    relationName: "documentVersions",
  }),
  versions: many(documents, { relationName: "documentVersions" }),
  jobApplications: many(jobApplications),
}));

export const generationJobsRelations = relations(
  generationJobs,
  ({ one }) => ({
    user: one(users, {
      fields: [generationJobs.userId],
      references: [users.id],
    }),
    document: one(documents, {
      fields: [generationJobs.documentId],
      references: [documents.id],
    }),
  })
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  user: one(users, { fields: [jobApplications.userId], references: [users.id] }),
  document: one(documents, {
    fields: [jobApplications.documentId],
    references: [documents.id],
  }),
}));

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type GenerationJob = typeof generationJobs.$inferSelect;
export type NewGenerationJob = typeof generationJobs.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;
