import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-elevation-2 hover:shadow-elevation-4 hover:-translate-y-0.5 active:translate-y-0",
        orange:
          "bg-gradient-to-r from-brand-orange-dark via-brand-orange to-brand-orange-light text-brand-blue-dark shadow-elevation-3 hover:shadow-elevation-5 hover:shadow-orange-glow hover:-translate-y-0.5 active:translate-y-0 font-bold",
        outline:
          "border-2 border-brand-orange bg-transparent text-brand-orange hover:bg-brand-orange/10 shadow-elevation-1 hover:shadow-elevation-3",
        "outline-blue":
          "border-2 border-brand-blue bg-transparent text-brand-blue hover:bg-brand-blue/10 shadow-elevation-1 hover:shadow-elevation-3",
        ghost:
          "text-foreground hover:bg-brand-orange/10 hover:text-brand-orange",
        link:
          "text-brand-orange underline-offset-4 hover:underline",
        secondary:
          "bg-secondary text-secondary-foreground shadow-elevation-2 hover:shadow-elevation-4 hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-elevation-2 hover:shadow-elevation-4 hover:-translate-y-0.5",
        hero:
          "bg-gradient-to-r from-brand-orange-dark via-brand-orange to-brand-orange-light text-brand-blue-dark font-bold shadow-elevation-4 hover:shadow-elevation-6 hover:shadow-orange-glow hover:-translate-y-1 active:translate-y-0 text-base",
        "hero-outline":
          "border-2 border-brand-sky bg-brand-blue-dark/50 text-brand-sky-light backdrop-blur-sm hover:bg-brand-orange/20 hover:border-brand-orange shadow-elevation-3 hover:shadow-elevation-5",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
