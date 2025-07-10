import { getCards } from "@/app/actions";
import CardItem from "@/components/cards/card-item";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { ICard } from "@/utils/types";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

async function CardsPage() {
  const { data, error } = await getCards();

  if (error) {
    return <p className="w-full text-center">Failed to fetch cards</p>;
  }

  return (
    <Container title="My Cards" description="Manage your cards" RightComponents={(
      <Button asChild variant='default'>
        <Link href='/admin/cards/new'>
          <PlusCircle />
          Add Card
        </Link>
      </Button>
    )}>
      <div className="flex flex-col w-full mt-10 space-y-4">
        <p className="mt-auto text-muted-foreground">
          Found {data.length} results
        </p>
        <div className="flex flex-col w-full gap-y-4 ">
{data.length > 0 &&
          data.map((item) => <CardItem key={item.id} card={item as ICard} />)}
        </div>

      </div>
    </Container>
  );
}

export default CardsPage;
