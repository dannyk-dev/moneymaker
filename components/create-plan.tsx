"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { PlusCircleIcon } from "lucide-react";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import InputNumber from "./ui/input-number";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";
import { useFilters } from "@/hooks/use-filters";
import { INTERVAL_UNIT_MAP, SUBSCRIPTION_STATUS_MAP } from "@/utils/constants";

const schema = z.object({
  name: z.string().min(1),
  status: z.string(),
  interval_unit: z.number(),
  interval_count: z.number().default(1),
  total_cycles: z.number().default(1),
  price: z.number().min(1),
});

const CreatePlan = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const planStatusMap = useFilters(SUBSCRIPTION_STATUS_MAP);
  const intervalUnitMap = useFilters(INTERVAL_UNIT_MAP);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      status: "ACTIVE",
      interval_unit: INTERVAL_UNIT_MAP.MONTH,
      interval_count: 1,
      total_cycles: 6,
      price: 10,
    },
  });

  const onSubmit = async ({
    name,
    status,
    price,
    interval_count,
    interval_unit,
    total_cycles,
  }: z.infer<typeof schema>) => {
    setLoading(true);

    try {
      await fetch("/api/paypal/plans", {
        body: JSON.stringify({
          name,
          status,
          billing_cycle: {
            frequency: {
              interval_count,
              interval_unit,
            },
            pricing_scheme: {
              fixed_price: {
                currency_code: "USD",
                value: price.toString(),
              },
            },
            total_cycles,
          },
        }),
        method: "POST",
      });

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon />
          New Subscription
        </Button>
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log(errors)
            )}
          >
            <DialogHeader>
              <DialogTitle>New Subscription</DialogTitle>
              <DialogDescription>
                Create a subscription to make recurring purchases from
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 w-full mt-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Test Purchase..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-x-4 items-baseline"
                      >
                        {planStatusMap.map(({ label, value }) => (
                          <FormItem
                            key={value}
                            className="flex items-center gap-3"
                          >
                            <FormControl>
                              <RadioGroupItem value={label} />
                            </FormControl>
                            <FormLabel>{label}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="interval_unit"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurrence</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(+val)}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select how often this payment occurs" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {intervalUnitMap.map(({ label, value }) => (
                          <SelectItem key={value} value={value.toString()}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="interval_count"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurrance Counter</FormLabel>
                    <FormDescription>
                      The number of intervals after which a subscriber is billed
                    </FormDescription>
                    <FormControl>
                      <InputNumber
                        minValue={1}
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="total_cycles"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Cycle</FormLabel>
                    <FormDescription>
                      The number of times this billing cycle gets executed.
                    </FormDescription>
                    <FormControl>
                      <InputNumber
                        minValue={1}
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormDescription>
                      Fixed Fee (No Tax included).
                    </FormDescription>
                    <FormControl>
                      <div className="relative">
                        <InputNumber
                          minValue={1}
                          defaultValue={field.value}
                          onChange={field.onChange}
                          className="pl-12"
                        />
                        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                          $
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button className="w-full mt-6" type="submit">
                {loading ? <Spinner isLoading={loading} /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlan;
