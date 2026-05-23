CREATE TABLE "analytics_event" (
	"id" text PRIMARY KEY NOT NULL,
	"siteToken" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"url" text NOT NULL,
	"referrer" text,
	"sessionId" text NOT NULL,
	"country" text,
	"deviceType" text,
	"browser" text,
	"eventName" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"domain" text NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "site_domain_unique" UNIQUE("domain"),
	CONSTRAINT "site_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_siteToken_site_token_fk" FOREIGN KEY ("siteToken") REFERENCES "public"."site"("token") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site" ADD CONSTRAINT "site_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;