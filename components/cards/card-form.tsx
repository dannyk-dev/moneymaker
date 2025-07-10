'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import GenericError from '@/utils/error';
import { convertMonthYearToCardExpiry, extractMonthYearFromCardExpiry } from '@/utils/helpers';
import { ICard, ICardRequest, ICardResponse } from '@/utils/types'
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

type Props = {
  defaultCard?: ICard;
}

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
  country_code: z.string().min(2).max(2).optional()
});

type TSchema = z.infer<typeof schema>

function CardForm({ defaultCard }: Props) {
  const defaultValues = useMemo(() => {
    if (defaultCard) {
      const { month, year } = extractMonthYearFromCardExpiry(defaultCard.expiry);

      return {
        ...defaultCard,
        expiry_month: month,
        expiry_year: year,
      } satisfies TSchema
    }

    return {}
  }, [defaultCard])

  const form = useForm<TSchema>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const handleSubmit = async (values: TSchema) => {
    const { expiry_month, expiry_year, ...payload } = values;
    const body: ICardRequest = {
      ...payload,
      expiry: convertMonthYearToCardExpiry(expiry_month, expiry_year),
      active: true,
    }

    try {
      const response = await fetch('/api/cards', {
          body: JSON.stringify(body),
          method: 'POST'
        });

      if (response.ok) {
        const data: ICardResponse = await response.json();

        toast(data.message)
      }

    } catch (error: any) {
      const err: GenericError = error;

      toast(err.message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-2'>
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
        <div className="grid grid-cols-3 gap-x-4">
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
                    <Input inputMode="numeric" placeholder="11000" {...field} />
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
        <Button className="w-full mt-6" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Spinner isLoading /> : 'Save Card'}
        </Button>
      </form>
    </Form>
  )
}

export default CardForm
