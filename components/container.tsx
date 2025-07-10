import React, { PropsWithChildren, ReactNode } from 'react'

type Props ={
  title: string;
  description?: string;
  RightComponents?: ReactNode;
}

function Container({ children, description, title, RightComponents }: Props & PropsWithChildren) {
  return (
    <div className="space-y-8 pb-10 min-h-[80vh]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium">
            {title}
          </h1>
          <p className="text-muted-foreground mt-2">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          {RightComponents && RightComponents}
        </div>
      </div>
      {children}
    </div>
  )
}

export default Container
