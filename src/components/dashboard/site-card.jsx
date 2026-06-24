"use client";

import { ArrowRight, Check, Copy, Edit, Trash2 } from "lucide-react";

import SiteLogo from "@/components/site-logo";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function SiteCard({
  site,
  onOpen,
  onCopy,
  onEdit,
  onDelete,
  copied,
  ownerLabel,
  mode = "manage",
}) {
  return (
    <Card
      onClick={onOpen}
      className="cursor-pointer hover:bg-muted transition-colors"
    >
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6 pb-3">
        <SiteLogo size={40} domain={site.domain} />
        <div className="flex flex-col gap-1 overflow-hidden">
          <CardTitle className="text-base font-bold leading-none uppercase tracking-tight truncate">
            {site.name}
          </CardTitle>
          <a
            href={`https://${site.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="text-sm text-muted-foreground hover:text-foreground hover:underline truncate w-fit"
          >
            {site.domain}
          </a>
          {ownerLabel && (
            <p className="text-xs text-muted-foreground truncate">
              Owner: {ownerLabel}
            </p>
          )}
        </div>
      </CardHeader>
      <CardFooter className="flex items-center justify-between p-6 pt-3 mt-auto">
        {mode === "manage" ? (
          <>
            <Button
              variant="ghost"
              onClick={(event) => {
                event.stopPropagation();
                onCopy?.();
              }}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Token
                </>
              )}
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit?.();
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete?.();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <Button className="ml-auto" variant="outline">
            View Analytics
            <ArrowRight className="size-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
