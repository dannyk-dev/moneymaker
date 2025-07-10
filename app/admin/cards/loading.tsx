import { Spinner } from '@/components/ui/spinner'
import React from 'react'


function CardLoadingPage() {
  return (
    <div className='w-full mx-auto'>
      <Spinner className='w-7 h-7' />
    </div>
  )
}

export default CardLoadingPage
