import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: NEXT_PUBLIC_BASE_URL
});