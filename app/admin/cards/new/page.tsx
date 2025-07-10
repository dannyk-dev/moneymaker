import BackButton from '@/components/back-button'
import CardForm from '@/components/cards/card-form'
import Container from '@/components/container'
import React from 'react'


function NewCardPage() {
  return (
   <>
    <BackButton />
    <Container title='New Card' description='Enter the card details below'>
      <CardForm />
    </Container>
   </>
  )
}

export default NewCardPage
