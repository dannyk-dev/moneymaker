"use client";

import { ICard } from "@/utils/types";
import {
  FileDown,
  ShieldCheck,
  ShieldX,
  SquarePen,
  TextSearch,
} from "lucide-react";
import React, { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { disableCard } from "@/app/actions";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import CardDetailsMock from "./card-details-mock";
import { FileCsvIcon, FileTxtIcon, FileCodeIcon } from "@phosphor-icons/react";

type Props = {
  card: ICard;
};

function CardItem({ card }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDisableCard = async () => {
    setLoading(true);
    const error = await disableCard(card.id, !card.active);

    if (error) {
      toast(error.message);
      setLoading(false);
      return;
    }

    toast(`${!card.active ? "Enabled" : "Disabled"} card ${card.name}`, {
      duration: 5000,
      action: (
        <Button
          size="sm"
          variant="secondary"
          onClick={async () => {
            await disableCard(card.id, true);
            toast("Card reverted back");
          }}
        >
          Undo
        </Button>
      ),
      icon: <ShieldX />,
    });

    router.refresh();
    setLoading(false);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger disabled={loading}>
        {loading ? (
          <Skeleton className="p-20 shadow-lg rounded-3xl w-full" />
        ) : (
          <CardDetailsMock card={card} />
        )}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem>
          <TextSearch />
          View Card
        </ContextMenuItem>
        <ContextMenuItem>
          <SquarePen />
          Edit Card
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-x-2">
            <FileDown />
            Export
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              <FileCsvIcon />
              CSV
            </ContextMenuItem>
            <ContextMenuItem>
              <FileTxtIcon />
              Plain Text
            </ContextMenuItem>
            <ContextMenuItem>
              <FileCodeIcon />
              JSON
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        {card.active ? (
          <ContextMenuItem variant="destructive" onClick={handleDisableCard}>
            <ShieldX />
            Disable
          </ContextMenuItem>
        ) : (
          <ContextMenuItem onClick={handleDisableCard}>
            <ShieldCheck />
            Enable
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default CardItem;
