'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sprout, Compass, Users } from 'lucide-react'

interface EmptyStateProps {
    type: 'projects' | 'squads'
}

export function EmptyState({ type }: EmptyStateProps) {
    const config = {
        projects: {
            icon: Sprout,
            title: 'No Projects Yet',
            description: "You haven't joined any project squads yet. Start exploring to find projects that need your help!",
            ctaLabel: 'Explore Projects',
            ctaLink: '/explore',
            ctaIcon: Compass
        },
        squads: {
            icon: Users,
            title: 'No Squads Yet',
            description: "Join a squad to collaborate with other developers on reviving abandoned projects.",
            ctaLabel: 'Find Squads',
            ctaLink: '/explore',
            ctaIcon: Users
        }
    }

    const { icon: Icon, title, description, ctaLabel, ctaLink, ctaIcon: CtaIcon } = config[type]

    return (
        <Card className="
      flex flex-col items-center justify-center text-center
      p-12 border-2 border-dashed border-forest-200 bg-forest-50/50
      rounded-3xl
    ">
            <div className="w-16 h-16 bg-white rounded-2xl border-2 border-forest-100 flex items-center justify-center mb-6 shadow-sm">
                <Icon className="w-8 h-8 text-forest-400" />
            </div>

            <h3 className="text-xl font-bold text-forest-900 mb-2">
                {title}
            </h3>

            <p className="text-forest-600 max-w-sm mb-8 leading-relaxed">
                {description}
            </p>

            <Button
                asChild
                className="rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold shadow-lg shadow-forest-700/20 px-8"
            >
                <Link href={ctaLink} className="flex items-center gap-2">
                    <CtaIcon className="w-4 h-4" />
                    {ctaLabel}
                </Link>
            </Button>
        </Card>
    )
}
