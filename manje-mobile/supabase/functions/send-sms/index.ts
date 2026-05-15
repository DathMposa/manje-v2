// supabase/functions/send-sms/index.ts
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

interface HookPayload {
  user: {
    id: string;
    phone: string;
  };
  sms: {
    otp: string;
  };
}

Deno.serve(async (req: Request) => {
  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);

    // 1. Verify the webhook signature from Supabase Auth
    const hookSecret = Deno.env.get("SEND_SMS_HOOK_SECRET");
    if (!hookSecret) {
      console.error("SEND_SMS_HOOK_SECRET not set");
      return new Response("Configuration error", { status: 500 });
    }

    // Supabase stores it as "v1,whsec_<base64>" — strip the prefix for StandardWebhooks
    const secret = hookSecret.replace("v1,whsec_", "");
    const wh = new Webhook(secret);
    const { user, sms } = wh.verify(payload, headers) as HookPayload;

    // 2. Build the SMS message
    const message = `Your Manje verification code is ${sms.otp}. Do not share this code. Expires in 5 minutes.`;

    // 3. Determine environment (sandbox vs live)
    const isProduction = Deno.env.get("AT_ENVIRONMENT") === "production";
    const apiBase = isProduction
      ? "https://api.africastalking.com/version1/messaging"
      : "https://api.sandbox.africastalking.com/version1/messaging";

    const atUsername = isProduction
      ? Deno.env.get("AT_USERNAME")!
      : "sandbox";
    const atApiKey = isProduction
      ? Deno.env.get("AT_API_KEY")!
      : Deno.env.get("AT_SANDBOX_API_KEY")!;

    // Sender ID only works on live; sandbox ignores it
    const senderId = isProduction
      ? (Deno.env.get("AT_SENDER_ID") ?? "Manje")
      : undefined;

    // 4. Call Africa's Talking SMS API
    const body = new URLSearchParams({
      username: atUsername,
      to: user.phone,       // E.164 format e.g. +265999123456
      message,
    });

    if (senderId) body.set("from", senderId);

    const atResponse = await fetch(apiBase, {
      method: "POST",
      headers: {
        apiKey: atApiKey,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const atResult = await atResponse.json();
    console.log("AT response:", JSON.stringify(atResult));

    // 5. Check AT delivery status
    const recipient = atResult?.SMSMessageData?.Recipients?.[0];
    if (!atResponse.ok || (recipient && recipient.statusCode !== 101)) {
      console.error("AT delivery failed:", atResult);
      return new Response("SMS delivery failed", { status: 500 });
    }

    // 6. Return empty 200 — Supabase Auth expects exactly this
    return new Response(null, { status: 200 });

  } catch (err) {
    console.error("Hook error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
