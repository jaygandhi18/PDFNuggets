"use client"
import { cn } from "@/lib/utils";
import { containerVariants, itemVariants, pricingPlans } from "@/utils/constants";
import { ArrowRight, CheckIcon } from "lucide-react";
import { useState } from "react";
import { MotionDiv, MotionSection } from "./motion-wrapper";

type PriceType = {
  name: string;
  price: number;
  description: string;
  items: string[];
  id: string;
  paymentLink: string; // unused now but kept for typing compatibility
  priceId: string;
};

const listVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
};

const PricingCard = ({
  name,
  price,
  description,
  items,
  id,
  priceId,
}: PriceType) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuyNow = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        setError(data.error || "Failed to create checkout session");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <MotionDiv
      variants={listVariant}
      whileHover={{ scale: 1.02 }}
      className="relative w-full max-w-lg hover:scale-105 transition-all duration-300"
    >
      <div
        className={cn(
          "relative flex flex-col h-full gap-5 lg:gap-8 z-10 p-8 rounded-2xl border-[1px] border-gray-500/20",
          name === "pro" && "border-teal-500 gap-5 border-2"
        )}
      >
        <MotionDiv variants={listVariant} className="flex justify-between items-center gap-4">
          <div>
            <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
            <p className="text-base-content/80 mt-2">{description}</p>
          </div>
        </MotionDiv>

        <MotionDiv variants={listVariant} className="flex gap-2">
          <p className="text-5xl tracking-tight font-extrabold">${price}</p>
          <div className="flex flex-col justify-end mb-[4px]">
            <p className="text-xs uppercase font-semibold">usd</p>
            <p className="text-xs">/month</p>
          </div>
        </MotionDiv>

        <MotionDiv variants={listVariant} className="space-y-2.5 leading-relaxed text-base flex-1">
          {items.map((item, idx) => (
            <li className="flex items-center gap-2" key={idx}>
              <CheckIcon size={18} className="text-teal-500" />
              <span>{item}</span>
            </li>
          ))}
        </MotionDiv>

        <MotionDiv variants={listVariant} className="space-y-2 flex justify-center w-full">
          <button
            disabled={loading}
            onClick={handleBuyNow}
            className={cn(
              "w-full rounded-full flex items-center justify-center gap-2 bg-linear-to-r from-teal-800 to-cyan-500 hover:from-cyan-500 hover:to-teal-800 text-white border-2 py-2",
              id === "pro" ? "border-teal-900" : "border-teal-100 from-teal-400 to-cyan-500"
            )}
          >
            {loading ? "Processing..." : "Buy Now"} <ArrowRight size={18} />
          </button>
        </MotionDiv>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </div>
    </MotionDiv>
  );
};

export default function PricingSection() {
  return (
    <MotionSection
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative overflow-hidden"
      id="pricing"
    >
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <MotionDiv variants={itemVariants} className="flex items-center justify-center w-full pb-12">
          <h2 className="uppercase font-bold text-xl mb-8 text-cyan-600">Pricing</h2>
        </MotionDiv>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
