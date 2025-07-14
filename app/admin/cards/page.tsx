import { getCards } from "@/app/actions";
import CardsList from "@/components/cards/cards-list";
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
    <Container
      title="My Cards"
      description="Manage your cards"
      RightComponents={
        <Button asChild variant="default">
          <Link href="/admin/cards/new">
            <PlusCircle />
            Add Card
          </Link>
        </Button>
      }
    >
      <CardsList cards={data as ICard[]} />
    </Container>
  );
}

export default CardsPage;
