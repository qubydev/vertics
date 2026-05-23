"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
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
import { Plus, LogOut, Copy, Check, Edit, Trash2, Globe, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [sites, setSites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");

  const [editingSite, setEditingSite] = useState(null);
  const [deletingSite, setDeletingSite] = useState(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, router, session]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchSites();
    }
  }, [session]);

  async function fetchSites() {
    try {
      const res = await fetch("/api/site", {
        headers: {
          "x-user-id": session.user.id
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSites(data);
      }
    } catch (error) {
      toast.error("Failed to fetch sites");
    }
  }

  async function handleAddSite(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id
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
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editingSite) return;

    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id
        },
        body: JSON.stringify({
          id: editingSite.id,
          name: editingSite.name,
          domain: editingSite.domain
        })
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
    }
  }

  async function handleDelete() {
    if (!deletingSite) return;

    try {
      const res = await fetch(`/api/site?id=${deletingSite.id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": session.user.id
        }
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
    }
  }

  function handleCopy(token, id) {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    toast.success("Token copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isPending || !session) {
    return null;
  }

  return (
    <main className="w-full max-w-4xl mx-auto p-8 flex flex-col gap-10 min-h-screen">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button
          variant="secondary"
          onClick={async () => {
            await authClient.signOut();
            router.replace("/");
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>

      <div className="w-full">
        <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Your Sites</h2>

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

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
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
                <form onSubmit={handleAddSite} className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Site Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. My Awesome Blog"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      required
                      placeholder="e.g. example.com"
                    />
                  </div>
                  <DialogFooter className="mt-4">
                    <Button type="submit">Save Site</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {filteredSites.length > 0 && (
          <div className="flex flex-col w-full bg-background">
            {filteredSites.map((s) => (
              <div
                key={s.id}
                onClick={() => router.push(`/dashboard/${s.id}`)}
                className="w-full py-2 border-b border-border last:border-b-0 flex justify-between items-center hover:bg-muted/50 cursor-pointer transition-colors px-4"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-lg flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    {s.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{s.domain}</p>
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
                    <Edit className="w-4 h-4" />
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
        )}

        {sites.length > 0 && filteredSites.length === 0 && (
          <div className="flex flex-col w-full items-center justify-center py-12 text-center text-muted-foreground border-t border-border">
            <Search className="w-8 h-8 mb-4 opacity-50" />
            <p>No sites match your search.</p>
          </div>
        )}

        {sites.length === 0 && (
          <div className="flex flex-col w-full items-center justify-center py-12 text-center text-muted-foreground border-t border-border">
            <Globe className="w-10 h-10 mb-4 opacity-50" />
            <p className="mb-2">No sites added yet.</p>
            <Button variant="link" onClick={() => setIsAddOpen(true)}>
              Add your first site
            </Button>
          </div>
        )}
      </div>

      <Dialog open={!!editingSite} onOpenChange={(open) => !open && setEditingSite(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Site</DialogTitle>
            <DialogDescription>
              Update the name or domain for your site.
            </DialogDescription>
          </DialogHeader>
          {editingSite && (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-name">Site Name</Label>
                <Input
                  id="edit-name"
                  type="text"
                  value={editingSite.name}
                  onChange={(e) => setEditingSite({ ...editingSite, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-domain">Domain</Label>
                <Input
                  id="edit-domain"
                  type="text"
                  value={editingSite.domain}
                  onChange={(e) => setEditingSite({ ...editingSite, domain: e.target.value })}
                  required
                />
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" type="button" onClick={() => setEditingSite(null)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingSite} onOpenChange={(open) => !open && setDeletingSite(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Site</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deletingSite?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeletingSite(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Confirm Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}