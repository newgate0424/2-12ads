'use client'

import { Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface LogoProps {
  collapsed?: boolean
  className?: string
}

export function Logo({ collapsed = false, className = '' }: LogoProps) {
  const { t } = useLanguage()
  
  if (collapsed) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="w-4 h-4 text-primary" strokeWidth={1.5} />
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Shield className="w-5 h-5 text-primary" strokeWidth={1.5} />
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className="text-base font-light tracking-wide text-foreground">
          ads169th System
        </span>
        <span className="text-[10px] font-light text-foreground/40 tracking-wider uppercase">
          {t('logo.subtitle')}
        </span>
      </div>
    </div>
  )
}
