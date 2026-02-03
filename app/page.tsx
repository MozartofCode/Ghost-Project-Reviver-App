import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github, Sparkles, Users, Zap, ArrowRight, Code2, Heart, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-phoenix-dark">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-lg bg-phoenix-dark/80 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-phoenix-accent" />
              <span className="text-xl font-bold gradient-text">Project Phoenix</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/explore">
                <Button variant="ghost" size="sm">Explore</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="primary" size="sm" className="gap-2">
                  <Github className="w-4 h-4" />
                  Sign in with GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-phoenix-accent/10 text-phoenix-accent border border-phoenix-accent/20 text-sm font-medium">
              🔥 Revive the code that matters
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Give <span className="gradient-text">Abandoned Projects</span>
            <br />
            A Second Life
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Discover valuable open-source repositories that need a new maintainer.
            Form revival squads, collaborate with developers, and bring ghost projects back to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/login">
              <Button size="lg" className="gap-2 group">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="secondary" size="lg">
                Browse Repositories
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold text-phoenix-primary">1,000+</p>
              <p className="text-gray-400 mt-2">Repositories Cataloged</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-phoenix-accent">500+</p>
              <p className="text-gray-400 mt-2">Active Developers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-500">50+</p>
              <p className="text-gray-400 mt-2">Projects Revived</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-phoenix-darker/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Three simple steps to revive a project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card glass>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-phoenix-primary/20 flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6 text-phoenix-primary" />
                </div>
                <CardTitle>1. Discover</CardTitle>
                <CardDescription>
                  Browse abandoned repositories scored by maintenance difficulty.
                  Filter by language, stars, and reviv ability score.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card glass>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-phoenix-accent/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-phoenix-accent" />
                </div>
                <CardTitle>2. Form a Squad</CardTitle>
                <CardDescription>
                  Join or create a revival squad. Collaborate with other developers,
                  assign roles, and coordinate the revival effort.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card glass>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle>3. Revive</CardTitle>
                <CardDescription>
                  Fork the project, fix issues, update dependencies, and bring it back to life.
                  Build your portfolio while helping the open-source community.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Project Phoenix?</h2>
            <p className="text-xl text-gray-400">Built for developers who want to make an impact</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} glass hover className="p-6">
                <feature.icon className="w-8 h-8 text-phoenix-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card glass className="p-12 text-center">
            <div className="mb-6">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">Ready to Revive a Project?</h2>
              <p className="text-xl text-gray-400 mb-8">
                Join hundreds of developers breathing new life into abandoned open-source projects
              </p>
            </div>
            <Link href="/auth/login">
              <Button size="lg" className="gap-2">
                <Github className="w-5 h-5" />
                Start with GitHub
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-phoenix-accent" />
                <span className="font-bold gradient-text">Project Phoenix</span>
              </div>
              <p className="text-sm text-gray-400">
                Reviving abandoned open-source projects, one repository at a time.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/explore" className="hover:text-white transition">Explore</Link></li>
                <li><Link href="#" className="hover:text-white transition">How it Works</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition">API</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition">License</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 Project Phoenix. Built with ❤️ for the open-source community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: TrendingUp,
    title: "Smart Discovery",
    description: "AI-powered algorithm finds abandoned projects worth reviving"
  },
  {
    icon: Code2,
    title: "Maintenance Scores",
    description: "Know what you're getting into with detailed difficulty metrics"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Form squads and tackle projects together with clear roles"
  },
  {
    icon: Github,
    title: "GitHub Integration",
    description: "Seamless sync with GitHub for authentication and repo data"
  },
  {
    icon: Sparkles,
    title: "Build Your Portfolio",
    description: "Get credit for real-world project maintenance experience"
  },
  {
    icon: Heart,
    title: "Give Back",
    description: "Help the open-source community by reviving valuable projects"
  },
  {
    icon: Zap,
    title: "Quick Start",
    description: "Get started in minutes with our guided onboarding process"
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor revival progress and celebrate milestones together"
  }
]
