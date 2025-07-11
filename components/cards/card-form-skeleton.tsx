import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const CardFormSkeleton = () => {
  return (
   <div className='space-y-4'>
    {/* -------- Cardholder Name ---------------------------------------- */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" /> {/* label */}
        <Skeleton className="h-10 w-full" />
      </div>

      {/* -------- Card Number ------------------------------------------- */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* -------- CVC / Expiry (grid 3 cols) ---------------------------- */}
      <div className="grid grid-cols-3 gap-x-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* -------- Billing address header ------------------------------- */}
      <Skeleton className="h-4 w-40" />

      {/* Street -------------------------------------------------------- */}
      <div className="space-y-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Unit ---------------------------------------------------------- */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* City / State / Zip (grid) ------------------------------------- */}
      <div className="grid grid-cols-3 gap-x-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Country ------------------------------------------------------- */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Submit button -------------------------------------------------- */}
      <Skeleton className="h-10 w-full mt-4" />
   </div>
  )
}

export default CardFormSkeleton
