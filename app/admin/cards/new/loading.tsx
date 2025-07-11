import CardFormSkeleton from '@/components/cards/card-form-skeleton'
import Container from '@/components/container'
import React from 'react'

const NewCardLoading = () => {
  return (
    <Container title='New Card' description='Enter the card details below'>
      <CardFormSkeleton />
    </Container>
  )
}

export default NewCardLoading
