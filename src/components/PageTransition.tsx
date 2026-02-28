import type { ReactNode } from 'react'

export default function PageTransition({
  children,
  stagger = false,
}: {
  children: ReactNode
  stagger?: boolean
}) {
  return (
    <div className={stagger ? 'page-transition-stagger' : 'page-transition'}>
      {children}
    </div>
  )
}
