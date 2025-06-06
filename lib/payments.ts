import Stripe from "stripe";
import { getDbConnection } from "./db";

// ✅ Subscription deleted handler
export async function handleSubscriptionDeleted({
  subscriptionId,
  stripe,
}: {
  subscriptionId: string;
  stripe: Stripe;
}) {
  console.log("Subscription Deleted:", subscriptionId);
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const sql = await getDbConnection();

    await sql`
      UPDATE users
      SET status = 'cancelled'
      WHERE customer_id = ${subscription.customer}
    `;

    console.log("Subscription cancelled successfully");
  } catch (err) {
    console.error("Error handling subscription deleted", err);
    throw err;
  }
}

// ✅ Checkout session completed handler
export async function handleCheckoutSessionCompleted({
  session,
  stripe,
}: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
}) {
  console.log("Checkout Session Completed", session);

  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const priceId = session?.metadata?.priceId || session?.line_items?.data[0]?.price?.id;

  if ("email" in customer && priceId) {
    const { email, name, metadata } = customer;
    const userId = metadata?.userId || session?.metadata?.userId;

    const sql = await getDbConnection();

    await createOrUpdateUser({
      sql,
      email: email as string,
      fullName: name as string,
      customerId,
      priceId: priceId as string,
      status: "active",
      userId: userId as string,
    });

    await createPayment({
      sql,
      session,
      priceId: priceId as string,
      userEmail: email as string,
    });
  }
}

// ✅ Insert or update user record with user_id
async function createOrUpdateUser({
  sql,
  email,
  fullName,
  customerId,
  priceId,
  status,
  userId,
}: {
  sql: any;
  email: string;
  fullName: string;
  customerId: string;
  priceId: string;
  status: string;
  userId: string;
}) {
  try {
    const user = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (user.length === 0) {
      await sql`
        INSERT INTO users (email, full_name, customer_id, price_id, status, user_id)
        VALUES (${email}, ${fullName}, ${customerId}, ${priceId}, ${status}, ${userId})
      `;
    } else {
      await sql`
        UPDATE users
        SET full_name = ${fullName}, customer_id = ${customerId}, price_id = ${priceId}, status = ${status}, user_id = ${userId}
        WHERE email = ${email}
      `;
    }

    console.log("User created or updated successfully.");
  } catch (err) {
    console.error("Error creating or updating user:", err);
  }
}

// ✅ Insert payment record (avoids duplicate insert)
async function createPayment({
  sql,
  session,
  priceId,
  userEmail,
}: {
  sql: any;
  session: Stripe.Checkout.Session;
  priceId: string;
  userEmail: string;
}) {
  try {
    const { amount_total, id, status } = session;

    const existing = await sql`
      SELECT 1 FROM payments WHERE stripe_payment_id = ${id}
    `;

    if (existing.length > 0) {
      console.log("Payment already exists, skipping insert.");
      return;
    }

    await sql`
      INSERT INTO payments (amount, status, stripe_payment_id, price_id, user_email)
      VALUES (${amount_total}, ${status}, ${id}, ${priceId}, ${userEmail})
    `;

    console.log("Payment recorded successfully.");
  } catch (error) {
    console.error("Error creating payment:", error);
  }
}
