import * as React from "react"
import { cn } from "@/lib/utils"
import type { AbandonmentStatus, SquadRole } from "@/types"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'status' | 'role'
    status?: AbandonmentStatus
    role?: SquadRole
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', status, role, children, ...props }, ref) => {
        const getStatusClass = (s?: AbandonmentStatus) => {
            if (!s) return ''
            const statusClasses = {
                active: 'badge-active',
                'at-risk': 'badge-at-risk',
                abandoned: 'badge-abandoned',
                reviving: 'badge-reviving',
            }
            return statusClasses[s] || ''
        }

        const getRoleClass = (r?: SquadRole) => {
            if (!r) return ''
            return 'px-3 py-1 rounded-full text-xs font-medium bg-phoenix-primary/20 text-phoenix-primary border border-phoenix-primary/30'
        }

        const baseClass = "inline-flex items-center gap-1"

        let appliedClass = baseClass
        if (variant === 'status' && status) {
            appliedClass = cn(baseClass, getStatusClass(status))
        } else if (variant === 'role' && role) {
            appliedClass = cn(baseClass, getRoleClass(role))
        } else {
            appliedClass = cn(baseClass, 'px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20', className)
        }

        return (
            <div
                ref={ref}
                className={cn(appliedClass, className)}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Badge.displayName = "Badge"

export { Badge }
