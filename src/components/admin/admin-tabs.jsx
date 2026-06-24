"use client";

import { AdminSitesGrid } from "@/components/admin/admin-sites-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
});

function formatDate(value) {
    if (!value) return "Unknown";
    return dateFormatter.format(new Date(value));
}

export function AdminTabs({ users, sites }) {
    return (
        <Tabs defaultValue="sites">
            <TabsList>
                <TabsTrigger value="sites">
                    Sites
                </TabsTrigger>
                <TabsTrigger value="users">
                    Users
                </TabsTrigger>
            </TabsList>

            <TabsContent value="sites">
                <AdminSitesGrid sites={sites} />
            </TabsContent>

            <TabsContent value="users">
                <Card>
                    <CardHeader className="border-b pb-6">
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Newest accounts.</CardDescription>
                    </CardHeader>
                    <CardContent className="divide-y px-0">
                        {users.map((account) => (
                            <div key={account.id} className="flex items-center gap-3 px-4 py-4 sm:px-6">
                                <Avatar>
                                    <AvatarFallback>
                                        {account.name?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                    <AvatarImage src={account.image} />
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold">{account.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{account.email}</p>
                                </div>
                                <p className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                                    {formatDate(account.createdAt)}
                                </p>
                            </div>
                        ))}
                        {users.length === 0 && (
                            <p className="px-6 py-8 text-sm text-muted-foreground">No users yet.</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
