import { httpRouter } from "convex/server";
import { api } from "./_generated/api";
import { internalAction } from "./_generated/server";

interface ClerkWebhookBody {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
    image_url?: string;
  };
}

// Clerk webhook handler using HTTP router
const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: async ({ ctx, request }) => {
    // Get the webhook secret
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new Response("CLERK_WEBHOOK_SECRET not set", { status: 500 });
    }

    // Get the headers
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing headers", { status: 400 });
    }

    // Get the body
    const body = await request.text();

    // Verify the webhook signature
    try {
      const Webhook = await import("svix").then((m) => m.Webhook);
      const wh = new Webhook(webhookSecret);
      
      const evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ClerkWebhookBody;

      const eventType = evt.type;

      // Handle user creation/update
      if (eventType === "user.created" || eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        
        const primaryEmail = email_addresses?.[0]?.email_address;
        const fullName = first_name && last_name 
          ? `${first_name} ${last_name}` 
          : first_name || undefined;

        await ctx.runMutation(api.users.syncUser, {
          clerkId: id,
          email: primaryEmail || "",
          name: fullName,
          imageUrl: image_url,
        });
      }

      // Handle user deletion
      if (eventType === "user.deleted") {
        const { id } = evt.data;
        await ctx.runMutation(api.users.deleteUser, {
          clerkId: id,
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response("Invalid signature", { status: 400 });
    }
  },
});

export default http;
