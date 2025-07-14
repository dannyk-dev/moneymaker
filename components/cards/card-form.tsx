"use client";

import { checkCardExists, disableCard } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useFilters } from "@/hooks/use-filters";
import { CARD_TYPE_MAP } from "@/utils/constants";
import GenericError from "@/utils/error";
import {
  convertMonthYearToCardExpiry,
  extractMonthYearFromCardExpiry,
} from "@/utils/helpers";
import { ICard, ICardRequest, ICardResponse } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  defaultCard?: ICard;
};

const schema = z.object({
  name: z.string().min(1).max(300),
  number: z.string().min(13).max(19),
  security_code: z.string().min(3).max(4),
  expiry_month: z.string().min(2).max(2),
  expiry_year: z.string().min(4).max(4),
  street: z.string().optional(),
  unit_number: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country_code: z.string().min(2).max(2).optional(),
  card_type: z.number(),
});

type TSchema = z.infer<typeof schema>;

function CardForm({ defaultCard }: Props) {
  const router = useRouter();
  const [cardExists, setCardExists] = useState<{
    exists: boolean;
    active: boolean;
    id: number | null;
  }>({
    exists: false,
    active: false,
    id: null,
  });
  const [activating, setActivating] = useState(false);
  const cardTypes = useFilters(CARD_TYPE_MAP);

  const defaultValues = useMemo(() => {
    if (defaultCard) {
      const { month, year } = extractMonthYearFromCardExpiry(
        defaultCard.expiry
      );

      return {
        ...defaultCard,
        expiry_month: month,
        expiry_year: year,
      } satisfies TSchema;
    }

    return {
      name: "",
      number: "",
      security_code: "",
      expiry_month: "",
      expiry_year: "",
      street: "",
      unit_number: "",
      state: "",
      city: "",
      postal_code: "",
      country_code: "",
      card_type: CARD_TYPE_MAP.PREPAID,
    } satisfies TSchema;
  }, [defaultCard]);

  const form = useForm<TSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const cardNumber = useWatch({ control: form.control, name: "number" });
  const debouncedNumber = useDebounce(cardNumber ?? "", 300);

  const handleSubmit = async (values: TSchema) => {
    const { expiry_month, expiry_year, ...payload } = values;
    const body: ICardRequest = {
      ...payload,
      card_type: payload.card_type,
      is_used: false,
      expiry: convertMonthYearToCardExpiry(expiry_month, expiry_year),
      active: true,
    };

    try {
      const response = await fetch("/api/cards", {
        body: JSON.stringify(body),
        method: "POST",
      });

      if (response.ok) {
        const data: ICardResponse = await response.json();

        toast(data.message);
        router.refresh();
      }
    } catch (error: any) {
      const err: GenericError = error;

      toast(err.message);
    }
  };

  useEffect(() => {
    const runCheck = async () => {
      const clean = debouncedNumber.replace(/\s+/g, "");
      if (clean.length < 13) return;

      try {
        const exists = await checkCardExists(clean);
        if (exists) setCardExists(exists);
      } catch (err) {
        console.error("card-exists check failed", err);
      }
    };

    if (debouncedNumber) runCheck();
  }, [debouncedNumber]);

  const resetCardExistsDialog = () => {
    form.setValue("number", "");
    setCardExists({
      active: false,
      exists: false,
      id: null,
    });
    setActivating(false);
  };

  const handleCardExistsDecision = async () => {
    if (cardExists.exists && cardExists.id) {
      if (!cardExists.active) {
        setActivating(true);
        const error = await disableCard(cardExists.id, true);

        if (error) {
          console.log(error);
          setCardExists({
            exists: false,
            active: false,
            id: null,
          });

          return toast("failed to enable card ");
        }

        toast("Activated card");
        resetCardExistsDialog();
      }

      router.push(`/admin/cards?id=${cardExists.id}`);
    }
  };

  return (
    <>
      <Dialog open={cardExists.exists} onOpenChange={resetCardExistsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>This card already exists</DialogTitle>
            <DialogDescription>
              {cardExists.active
                ? "Would you like to go view this card?"
                : "This card is already active. Activate it now?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              className="w-1/2"
              variant="ghost"
              onClick={resetCardExistsDialog}
            >
              Cancel
            </Button>
            <Button
              className="w-1/2"
              variant={cardExists.active ? "default" : "destructive"}
              onClick={handleCardExistsDecision}
              loading={activating}
              loadingText="Activating..."
            >
              {cardExists.active ? "View card" : "Yes, activate now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cardholder Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ------------------------------------------------ Number ----------- */}
          <FormField
            name="number"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    placeholder="4111 1111 1111 1111"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ------------------------------------------------ Security code ---- */}
          <div className="grid grid-cols-4 gap-x-4">
            <FormField
              name="card_type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Type</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(+val)}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cardTypes.map(({ label, value }) => (
                        <SelectItem key={value} value={value.toString()}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              name="security_code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVC / CVV</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="123"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------------------------------------ Expiry month -------- */}
            <FormField
              name="expiry_month"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry MM</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="04"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------------------------------------ Expiry year --------- */}
            <FormField
              name="expiry_year"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry YYYY</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="2028"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ------------------------------------------------ Address block ---- */}
          <div className="space-y-2 mt-4">
            <FormDescription>Billing Address (optional)</FormDescription>

            <FormField
              name="street"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="unit_number"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit / Apt</FormLabel>
                  <FormControl>
                    <Input placeholder="Apt 4B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-x-4">
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Maputo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="state"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State / Province</FormLabel>
                    <FormControl>
                      <Input placeholder="GA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="postal_code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        placeholder="11000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="country_code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country Code (ISO 2-letter)</FormLabel>
                  <FormControl>
                    <Input placeholder="MZ" maxLength={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ------------------------------------------------ Submit ---------- */}
          <Button
            className="w-full mt-6"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? <Spinner isLoading /> : "Save Card"}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default CardForm;
