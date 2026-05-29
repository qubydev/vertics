import {
    pgTable,
    text,
    boolean,
    timestamp,
    integer,
    index,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expiresAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    idToken: text("idToken"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const site = pgTable("site", {
    id: text("id").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    domain: text("domain").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const analyticsEvent = pgTable("analytics_event", {
    id: text("id").primaryKey(),
    siteId: text("siteId")
        .notNull()
        .references(() => site.id, { onDelete: "cascade" }),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
    eventName: text("eventName").notNull(),
    pathname: text("pathname").notNull(),
    duration: integer("duration"),
    visitorId: text("visitorId").notNull(),
    sessionId: text("sessionId").notNull(),
    referrer: text("referrer"),
    referrerUrl: text("referrerUrl"),
    country: text("country"),
    city: text("city"),
    deviceType: text("deviceType"),
    browser: text("browser"),
    os: text("os"),
}, (table) => ({
    siteTimeIdx: index("event_site_time_idx").on(table.siteId, table.timestamp),
    sessionIdx: index("event_session_idx").on(table.sessionId),
    visitorIdx: index("event_visitor_idx").on(table.visitorId),
    pathnameIdx: index("event_pathname_idx").on(table.siteId, table.pathname),
}));