import { Toaster } from '@/components/ui/fragments/shadcn-ui/sonner'
import { TooltipProvider } from '@/components/ui/fragments/shadcn-ui/tooltip'
import React from 'react'

type componentProps = {
    children : React.ReactNode
}

function Provider({children } : componentProps) {
  return (
<div className="">
    <TooltipProvider>
    <Toaster position="top-center"/>
    {children}
    </TooltipProvider>
</div>
  )
}

export default Provider