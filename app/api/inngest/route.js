import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserDeletion, syncUserUpdate } from "@/config/innjest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    // These functions will be triggered by Clerk events
    // They will sync user data with MongoDB when a user is created, updated, or deleted
        syncUserCreation,
        syncUserDeletion,
        syncUserUpdate
  ],
});
