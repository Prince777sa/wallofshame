import { pgTable, serial, text, timestamp, integer, varchar, unique } from "drizzle-orm/pg-core";

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  type: varchar("type", { length: 20 }).notNull().default("person"), // 'person' or 'organization'
  industry: varchar("industry", { length: 100 }), // Industry category for organizations (null for persons)
  country: varchar("country", { length: 100 }).notNull(),
  side: varchar("side", { length: 10 }).notNull(), // 'good' or 'bad'
  description: text("description").notNull(),
  links: text("links").array(), // Array of evidence links (max 10)
  imageUrl: text("image_url"),
  likes: integer("likes").default(0).notNull(),
  dislikes: integer("dislikes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    cardId: integer("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    ipAddress: varchar("ip_address", { length: 45 }).notNull(),
    voteType: varchar("vote_type", { length: 10 }).notNull(), // 'like' or 'dislike'
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueVote: unique().on(table.cardId, table.ipAddress),
  })
);

export const disputes = pgTable("disputes", {
  id: serial("id").primaryKey(),
  cardId: integer("card_id")
    .notNull()
    .references(() => cards.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const linkTitles = pgTable("link_titles", {
  id: serial("id").primaryKey(),
  url: text("url").notNull().unique(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
