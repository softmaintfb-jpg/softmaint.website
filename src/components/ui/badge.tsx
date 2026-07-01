import React, { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline'
  children: React.ReactNode
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium'
    const variantStyles = {
      default: 'bg-amber-100 text-amber-700',
      outline: 'border border-gray-300 text-gray-700'
    }
    
    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className || ''}`}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'
