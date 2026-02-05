'use client'

import { Card } from '@/components/ui/card'
import { Sprout, Users, Award, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface StatsGridProps {
    stats: {
        total_projects: number
        total_squads: number
        total_contributions: number
        account_created: string
    }
}

export function StatsGrid({ stats }: StatsGridProps) {
    const statItems = [
        {
            label: 'Projects Involved',
            value: stats.total_projects,
            icon: Sprout,
            color: 'text-emerald-700',
            bg: 'bg-emerald-100',
            borderColor: 'border-emerald-200'
        },
        {
            label: 'Squads Joined',
            value: stats.total_squads,
            icon: Users,
            color: 'text-blue-700',
            bg: 'bg-blue-100',
            borderColor: 'border-blue-200'
        },
        {
            label: 'Contributions',
            value: stats.total_contributions,
            icon: Award,
            color: 'text-amber-700',
            bg: 'bg-amber-100',
            borderColor: 'border-amber-200',
            subtext: 'Coming Soon'
        },
        {
            label: 'Reviving Since',
            value: stats.account_created ? format(new Date(stats.account_created), 'MMMM yyyy') : '-',
            icon: Calendar,
            color: 'text-purple-700',
            bg: 'bg-purple-100',
            borderColor: 'border-purple-200',
            isDate: true
        }
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statItems.map((item, index) => {
                const Icon = item.icon
                return (
                    <Card
                        key={index}
                        className={`
              p-4 border-2 rounded-2xl shadow-sm
              ${item.borderColor} bg-white/50 backdrop-blur-sm
              hover:scale-[1.02] transition-transform duration-300
            `}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-xl ${item.bg}`}>
                                <Icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <p className="text-sm font-semibold text-forest-600">{item.label}</p>
                        </div>

                        <div className="pl-1">
                            <p className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-forest-900 to-forest-700`}>
                                {item.value}
                            </p>
                            {item.subtext && (
                                <p className="text-xs text-forest-400 mt-1 font-medium bg-forest-50 inline-block px-1.5 py-0.5 rounded">
                                    {item.subtext}
                                </p>
                            )}
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}
