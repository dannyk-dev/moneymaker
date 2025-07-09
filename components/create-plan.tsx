"use client";

import { INTERVAL_UNITS, SubscriptionStatus } from "@/utils/types";
import React from "react";
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

type Props = {};

const schema = z.object({
  name: z.string().min(1),
  status: z.nativeEnum(SubscriptionStatus),
  interval_unit: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
  interval_count: z.number().default(1),
  total_cycles: z.number().default(1),
  price: z.number().min(1),
});

const CreatePlan = (props: Props) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: SubscriptionStatus.ACTIVE,
      interval_unit: "MONTH",
      interval_count: 1,
      total_cycles: 6,
      price: 10,
    },
  });

  return (
    <Dialog>
      <Form {...form}>
        <form action="">
          <DialogTrigger asChild>
            <Button>
              <PlusCircleIcon />
              New Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Subscription</DialogTitle>
              <DialogDescription>
                Create a subscription to make recurring purchases from
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 w-full">
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
                        defaultValue={field.value.toString()}
                        className="flex gap-x-4 items-baseline"
                      >
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem
                              value={SubscriptionStatus.ACTIVE.toString()}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Active</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem
                              value={SubscriptionStatus.CREATED.toString()}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Idle</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem
                              value={SubscriptionStatus.INACTIVE.toString()}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Inactive
                          </FormLabel>
                        </FormItem>
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select how often this payment occurs" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INTERVAL_UNITS.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
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
              <Button className="w-full mt-4" type="submit">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default CreatePlan;
