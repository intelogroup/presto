import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
        "flex flex-col rounded-xl border p-6 shadow-sm",
        highlighted
          ? "border-primary bg-card ring-1 ring-primary"
          : "border-border bg-card"
      )}
    >
      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      <div className="mt-2">
        <span className="text-3xl font-semibold text-foreground">{price}</span>
        {price !== "Free" && (
          <span className="text-sm text-muted-foreground">/month</span>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      <ul className="mt-6 flex-1 space-y-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <svg
              className="mt-0.5 size-4 shrink-0 text-accent"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <a href={href} className="mt-6">
        <Button
          className="w-full"
          variant={highlighted ? "default" : "outline"}
        >
          {cta}
        </Button>
      </a>
    </div>
  );
}
