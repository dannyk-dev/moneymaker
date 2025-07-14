"use client";

import { ICard } from "@/utils/types";
import React, { useCallback, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CardItem from "./card-item";

type Props = {
  cards: ICard[];
};

type TStatusFilters = "active" | "inactive" | "used" | "unused";

const CardsList = ({ cards }: Props) => {
  const [tab, setTab] = useState<TStatusFilters>("active");

  const filterByActivity = useCallback(
    (cards: ICard[], active: boolean = false) => {
      return cards.filter((item) => item.active === active);
    },
    []
  );

  const filterByUsage = useCallback(
    (cards: ICard[], isUsed: boolean = false) => {
      return cards.filter((item) => item.is_used === isUsed);
    },
    []
  );

  const tabData = useMemo(() => {
    const statusDisableCondition = tab === "active" || tab === "used";

    if (tab === "active" || tab === "inactive") {
      return filterByActivity(cards, statusDisableCondition);
    }

    return filterByUsage(cards, statusDisableCondition);
  }, [tab, cards]);

  return (
    <Tabs
      defaultValue="active"
      onValueChange={(val) => setTab(val as TStatusFilters)}
      value={tab}
    >
      <div className="w-full flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Disabled</TabsTrigger>
          <TabsTrigger value="used">Used</TabsTrigger>
          <TabsTrigger value="unused">New</TabsTrigger>
        </TabsList>
        <p className="mt-auto text-muted-foreground ml-auto">
          Found {tabData.length} results
        </p>
      </div>
      <TabsContent value={tab}>
        <div className="flex flex-col w-full pt-4 space-y-3">
          <div className="flex flex-col w-full gap-y-4 ">
            {tabData.length > 0 &&
              tabData.map((item) => (
                <CardItem key={item.id} card={item as ICard} />
              ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CardsList;
