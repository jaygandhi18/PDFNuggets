import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = async (req: NextRequest) => {
  try {
    const { priceId, userId } = await req.json();

    if (!priceId || !userId) {
      return NextResponse.json({ error: "Missing priceId or userId" }, { status: 400 });
    }

    const protocol = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http") ? "" : "https://";
    const domainURL = protocol + (process.env.NEXT_PUBLIC_SITE_URL || "localhost:3000");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        userId, // ✅ This ensures webhook gets it
        priceId, // Optional but useful
      },
      success_url: `${domainURL}/upload?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
