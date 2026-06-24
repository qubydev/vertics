"use client";

import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Copy, Check, Edit, Trash2, Globe, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import SiteLogo from "@/components/site-logo";

export default function Dashboard() {
  const router = useRouter();
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [domainError, setDomainError] = useState("");
  const [editingDomainError, setEditingDomainError] = useState("");
  const [editingSite, setEditingSite] = useState(null);
  const [deletingSite, setDeletingSite] = useState(null);
  const [isSavingSite, setIsSavingSite] = useState(false);
  const [isDeletingSite, setIsDeletingSite] = useState(false);
  const [isUpdatingSite, setIsUpdatingSite] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  async function fetchSites() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/site");
      if (res.ok) {
        const data = await res.json();
        setSites(data);
      } else {
        throw new Error(`Error ${res.status}`);
      }
    } catch (error) {
      toast.error("Failed to fetch sites");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddSite() {
    if (!name.trim() || !domain.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!validateDomain(domain)) {
      setDomainError("Invalid domain format (e.g., example.com)");
      return;
    }

    setDomainError("");
    setIsSavingSite(true);
    try {
      const res = await fetch("/api/site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, domain }),
      });
      if (res.ok) {
        setName("");
        setDomain("");
        setIsAddOpen(false);
        fetchSites();
        toast.success("Website added successfully");
      } else {
        toast.error("Failed to add website");
      }
    } catch (error) {
      toast.error("An error occurred while adding the website");
    } finally {
      setIsSavingSite(false);
    }
  }

  async function handleUpdate() {
    if (!editingSite) return;

    if (!editingSite.name.trim() || !editingSite.domain.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!validateDomain(editingSite.domain)) {
      setEditingDomainError("Invalid domain format (e.g., example.com)");
      return;
    }

    setEditingDomainError("");
    setIsUpdatingSite(true);
    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingSite.id,
          name: editingSite.name,
          domain: editingSite.domain,
        }),
      });
      if (res.ok) {
        setEditingSite(null);
        fetchSites();
        toast.success("Website updated successfully");
      } else {
        toast.error("Failed to update website");
      }
    } catch (error) {
      toast.error("An error occurred while updating the website");
    } finally {
      setIsUpdatingSite(false);
    }
  }

  async function handleDelete() {
    if (!deletingSite) return;

    setIsDeletingSite(true);
    try {
      const res = await fetch(`/api/site?id=${deletingSite.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingSite(null);
        fetchSites();
        toast.success("Website deleted successfully");
      } else {
        toast.error("Failed to delete website");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the website");
    } finally {
      setIsDeletingSite(false);
    }
  }

  function validateDomain(domain) {
    if (!domain.trim()) return false;
    let cleanDomain = domain.trim().replace(/^(https?:\/\/)?(www\.)?/, "");
    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/i;
    return domainRegex.test(cleanDomain);
  }

  function handleCopy(token, id) {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    toast.success("Token copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filteredSites = sites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24">
      <div className="fixed top-0 left-0 w-screen flex items-center justify-center z-50 mx-auto">
        <div className="max-w-264 w-full sm:px-4 sm:pt-4">
          <Navbar />
        </div>
      </div>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-lg font-bold uppercase tracking-tight text-muted-foreground">Your Websites</h1>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={isAddOpen} onOpenChange={(open) => {
              setIsAddOpen(open);
              if (!open) {
                setDomainError("");
              }
            }}>
              <DialogTrigger asChild>
                <Button className="shrink-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="uppercase tracking-tight">Add New Website</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new website below.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Website Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. My Awesome Blog"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      type="text"
                      value={domain}
                      onChange={(e) => {
                        setDomain(e.target.value);
                        setDomainError("");
                      }}
                      placeholder="e.g. example.com"
                      className={domainError ? "border-destructive" : ""}
                    />
                    {domainError && (
                      <p className="text-xs text-destructive">{domainError}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddSite} disabled={isSavingSite}>
                    {isSavingSite ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Website"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6 pb-3">
                  <Skeleton className="h-10 w-10 shrink-0" />
                  <div className="flex flex-col gap-2 w-full">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardHeader>
                <CardFooter className="flex items-center justify-between p-6 pt-3 mt-auto">
                  <Skeleton className="h-9 w-32" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredSites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.map((s) => (
              <Card
                key={s.id}
                onClick={() => router.push(`/dashboard/${s.id}`)}
                className="cursor-pointer hover:bg-muted transition-colors"
              >
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6 pb-3">
                  <SiteLogo size={40} domain={s.domain} />
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <CardTitle className="text-base font-bold leading-none uppercase tracking-tight truncate">
                      {s.name}
                    </CardTitle>
                    <a
                      href={`https://${s.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-muted-foreground hover:text-foreground hover:underline truncate w-fit"
                    >
                      {s.domain}
                    </a>
                  </div>
                </CardHeader>
                <CardFooter className="flex items-center justify-between p-6 pt-3 mt-auto">
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(s.token, s.id);
                    }}
                  >
                    {copiedId === s.id ? (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSite(s);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingSite(s);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : sites.length > 0 && filteredSites.length === 0 ? (
          <div className="flex flex-col w-full items-center justify-center py-20 text-center">
            <Search className="w-10 h-10 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-1 uppercase tracking-tight">No matches found</h3>
            <p className="text-sm text-muted-foreground">Adjust your search query and try again.</p>
          </div>
        ) : (
          <div className="flex flex-col w-full items-center justify-center py-24 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-tight">No sites active</p>
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </div>
        )}

        <Dialog
          open={!!editingSite}
          onOpenChange={(open) => {
            if (!open) {
              setEditingSite(null);
              setEditingDomainError("");
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="uppercase tracking-tight">Edit Website</DialogTitle>
              <DialogDescription>
                Update the name or domain for your website.
              </DialogDescription>
            </DialogHeader>
            {editingSite && (
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-name">Website Name</Label>
                  <Input
                    id="edit-name"
                    type="text"
                    value={editingSite.name}
                    onChange={(e) =>
                      setEditingSite({ ...editingSite, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-domain">Domain</Label>
                  <Input
                    id="edit-domain"
                    type="text"
                    value={editingSite.domain}
                    onChange={(e) => {
                      setEditingSite({ ...editingSite, domain: e.target.value });
                      setEditingDomainError("");
                    }}
                    className={editingDomainError ? "border-destructive" : ""}
                  />
                  {editingDomainError && (
                    <p className="text-xs text-destructive">{editingDomainError}</p>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditingSite(null)}
                disabled={isUpdatingSite}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={isUpdatingSite}>
                {isUpdatingSite ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!deletingSite}
          onOpenChange={(open) => !open && setDeletingSite(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="uppercase tracking-tight text-destructive">Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{deletingSite?.name}</strong>?
                This action cannot be undone and all associated telemetry will be lost.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setDeletingSite(null)}
                disabled={isDeletingSite}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeletingSite}
              >
                {isDeletingSite ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Website"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
