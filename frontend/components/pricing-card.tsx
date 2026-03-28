"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  href,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-7 transition-all duration-300",
        highlighted
          ? "border-primary/40 bg-card shadow-xl shadow-primary/10 scale-[1.02]"
          : "border-border/60 bg-card shadow-sm hover:shadow-md hover:border-border"
      )}
    >
      {/* Popular badge */}
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary to-primary/80 px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25">
            Most Popular
          </span>
        </div>
      )}

      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-foreground">{price}</span>
        {price !== "Free" && (
          <span className="text-sm text-muted-foreground">/month</span>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      <ul className="mt-7 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <div className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
              highlighted ? "bg-primary/10" : "bg-accent/10"
            )}>
              <svg
                className={cn("size-3", highlighted ? "text-primary" : "text-accent")}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: highlighted ? "default" : "outline", size: "lg" }),
          "mt-7 w-full rounded-xl",
          highlighted && "shadow-md shadow-primary/20"
        )}
      >
        {cta}
      </Link>
    </div>
  );
}
