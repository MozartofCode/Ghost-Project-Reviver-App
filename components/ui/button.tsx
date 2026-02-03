import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"

        const variants = {
            primary: "bg-phoenix-primary hover:bg-phoenix-primary-light text-white shadow-lg shadow-phoenix-primary/20 hover:shadow-phoenix-primary/40 hover:-translate-y-0.5",
            secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20",
            ghost: "bg-transparent hover:bg-white/5 text-white",
            danger: "bg-red-600 hover:bg-red-700 text-white",
        }

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
        }

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                {...props}
            >
                {children}
            </button>
        )
    }
)

Button.displayName = "Button"

export { Button }
