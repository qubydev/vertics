ALTER TABLE "analytics_event" RENAME COLUMN "url" TO "pathname";--> statement-breakpoint
ALTER TABLE "analytics_event" DROP CONSTRAINT "analytics_event_siteToken_site_token_fk";
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "analytics_event" ALTER COLUMN "timestamp" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "site" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "site" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "analytics_event" ADD COLUMN "siteId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "analytics_event" ADD COLUMN "duration" integer;--> statement-breakpoint
ALTER TABLE "analytics_event" ADD COLUMN "visitorId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "analytics_event" ADD COLUMN "referrerUrl" text;--> statement-breakpoint
ALTER TABLE "analytics_event" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_siteId_site_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_site_time_idx" ON "analytics_event" USING btree ("siteId","timestamp");--> statement-breakpoint
CREATE INDEX "event_session_idx" ON "analytics_event" USING btree ("sessionId");--> statement-breakpoint
CREATE INDEX "event_visitor_idx" ON "analytics_event" USING btree ("visitorId");--> statement-breakpoint
CREATE INDEX "event_pathname_idx" ON "analytics_event" USING btree ("siteId","pathname");--> statement-breakpoint
ALTER TABLE "analytics_event" DROP COLUMN "siteToken";