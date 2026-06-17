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
import { Plus, Copy, Check, Edit, Trash2, Globe, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
        toast.success("Site added successfully");
      } else {
        toast.error("Failed to add site");
      }
    } catch (error) {
      toast.error("An error occurred while adding the site");
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
        toast.success("Site updated successfully");
      } else {
        toast.error("Failed to update site");
      }
    } catch (error) {
      toast.error("An error occurred while updating the site");
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
        toast.success("Site deleted successfully");
      } else {
        toast.error("Failed to delete site");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the site");
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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-8 flex flex-col gap-10 mt-4 sm:mt-8">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Sites</h2>
            <div className="flex w-full sm:w-auto items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sites..."
                  className="pl-8 h-10 w-full bg-background"
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
                    Add New Site
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Site</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new site below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name">Site Name</Label>
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
                        className={domainError ? "border-red-500" : ""}
                      />
                      {domainError && (
                        <p className="text-xs text-red-500">{domainError}</p>
                      )}
                    </div>
                    <DialogFooter className="mt-4">
                      <Button
                        onClick={handleAddSite}
                        disabled={isSavingSite}
                      >
                        {isSavingSite ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Site"
                        )}
                      </Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col w-full bg-background border border-border rounded-xl overflow-hidden shadow-sm">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full py-6 border-b border-border last:border-b-0 flex justify-between items-center hover:bg-muted/50 px-6"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Skeleton className="h-10 w-10 rounded-md shrink-0" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Skeleton className="h-10 w-32 rounded" />
                    <Skeleton className="h-10 w-10 rounded" />
                    <Skeleton className="h-10 w-10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSites.length > 0 ? (
            <div className="flex flex-col w-full bg-background border border-border rounded-xl overflow-hidden shadow-sm">
              {filteredSites.map((s) => (
                <div
                  key={s.id}
                  onClick={() => router.push(`/dashboard/${s.id}`)}
                  className="w-full py-6 border-b border-border last:border-b-0 flex justify-between items-center hover:bg-muted/50 cursor-pointer transition-colors px-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/30 shrink-0">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold text-foreground">
                        {s.name}
                      </h3>
                      <a
                        href={`https://${s.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-muted-foreground hover:text-foreground hover:underline w-fit"
                      >
                        {s.domain}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(s.token, s.id);
                      }}
                      className="w-32"
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSite(s);
                      }}
                    >
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingSite(s);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : sites.length > 0 && filteredSites.length === 0 ? (
            <div className="flex flex-col w-full items-center justify-center py-12 text-center text-muted-foreground border border-border rounded-xl border-dashed mt-6">
              <Search className="w-8 h-8 mb-4 opacity-50" />
              <p>No sites match your search.</p>
            </div>
          ) : (
            <div className="flex flex-col w-full items-center justify-center py-16 text-center text-muted-foreground border border-border rounded-xl border-dashed mt-6 bg-muted/20">
              <Globe className="w-10 h-10 mb-4 opacity-50 text-foreground" />
              <p className="mb-2 text-foreground font-medium">No sites added yet.</p>
              <p className="text-sm mb-4">Add a site to start tracking your analytics.</p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add your first site
              </Button>
            </div>
          )}
        </div>

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
              <DialogTitle>Edit Site</DialogTitle>
              <DialogDescription>
                Update the name or domain for your site.
              </DialogDescription>
            </DialogHeader>
            {editingSite && (
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-name">Site Name</Label>
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
                    className={editingDomainError ? "border-red-500" : ""}
                  />
                  {editingDomainError && (
                    <p className="text-xs text-red-500">{editingDomainError}</p>
                  )}
                </div>
                <DialogFooter className="mt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setEditingSite(null)}
                    disabled={isUpdatingSite}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    disabled={isUpdatingSite}
                  >
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
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!deletingSite}
          onOpenChange={(open) => !open && setDeletingSite(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Site</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{deletingSite?.name}</strong>?
                This action cannot be undone.
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
                  "Confirm Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}