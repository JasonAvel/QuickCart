import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";

// Create Inngest client
export const inngest = new Inngest({ id: "quickcart-next" });

/**
 * Handle Clerk user creation event
 */
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id, // Only if you're using Clerk's ID as MongoDB _id
      email: email_addresses[0].email_address,
      name: first_name +' '+ last_name,
      imageUrl: image_url,
    };

    await connectDB();
    await User.create(userData);
  }
);

/**
 * Handle Clerk user update event
 */
export const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      email: email_addresses[0].email_address,
      name: first_name +' '+ last_name,
      imageUrl: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);
    // await User.findByIdAndUpdate(id, userData, { new: true, upsert: true });
    // The upsert option will create a new document if no document matches the query
    // The new option will return the updated document
    // upsert: true ensures it creates the user if they don’t already exist (safety fallback).

  }
);


// inngest function to delete user from database

export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-deletion-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const {id} = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);