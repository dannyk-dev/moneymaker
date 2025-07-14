import { cn } from "@/lib/utils";
import { ICard } from "@/utils/types";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CreditCardIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { extractMonthYearFromCardExpiry } from "@/utils/helpers";

type Props = {
  card: ICard;
};

const mask = (pan: string) =>
  pan
    .replace(/\s/g, "") // remove spaces
    .replace(/\d(?=\d{4})/g, "•") // hide all but last 4
    .replace(/(.{4})/g, "$1 ") // group 4-by-4
    .trim();

const CardDetailsMock = ({ card }: Props) => {
  const { month, year } = extractMonthYearFromCardExpiry(card.expiry);

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 ",
        card.active
          ? "bg-primary text-primary-foreground hover:shadow-primary/60"
          : "bg-secondary text-secondary-foreground opacity-80 hover:opacity-100"
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute -left-10 -top-8 h-48 w-48 rounded-full opacity-20 blur-3xl",
          card.active ? "bg-white" : "bg-muted"
        )}
      />

      <CreditCardIcon
        className="absolute right-6 top-6 h-8 w-8 opacity-30"
        strokeWidth={1.5}
      />

      <Badge
        variant={card.active ? "success" : "destructive"}
        className="absolute left-6 top-6 select-none"
      >
        {card.active ? "ACTIVE" : "DISABLED"}
      </Badge>

      <CardHeader className="pt-16 pb-6 px-0">
        <CardTitle className="font-mono text-2xl tracking-wide">
          {mask(card.number)}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-end justify-between px-0">
        <CardDescription className="uppercase tracking-wide text-primary-foreground">
          {card.name}
        </CardDescription>

        {month && year && (
          <span className="text-sm">
            {month}/{year.toString().slice(-2)}
          </span>
        )}
      </CardContent>
    </Card>
  );
};

export default CardDetailsMock;
