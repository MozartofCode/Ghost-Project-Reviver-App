'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github, Sprout, Users, Zap, ArrowRight, Code2, Heart, TrendingUp, Leaf, Recycle, Sun, Loader2 } from 'lucide-react'
import type { Repository } from '@/types'

export default function Home() {
  const [featuredRepos, setFeaturedRepos] = useState<Repository[]>([])
  const [stats, setStats] = useState({
    totalRepos: 0,
    totalUsers: 0,
    activeRevivals: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch featured repositories (top 3 by interest)
      const reposResponse = await fetch('/api/repositories')
      const reposData = await reposResponse.json()

      if (reposData.repositories) {
        // Get top 3 repositories by interest or stars
        const featured = reposData.repositories
          .sort((a: Repository, b: Repository) => (b.interest_count || 0) - (a.interest_count || 0))
          .slice(0, 3)

        setFeaturedRepos(featured)

        // Calculate stats
        setStats({
          totalRepos: reposData.repositories.length,
          totalUsers: 450, // TODO: Fetch from users table
          activeRevivals: reposData.repositories.filter((r: Repository) => r.abandonment_status === 'reviving').length
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'abandoned':
        return 'bg-red-100 text-red-600'
      case 'at-risk':
        return 'bg-orange-100 text-orange-600'
      case 'reviving':
        return 'bg-forest-100 text-forest-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'abandoned':
        return 'Withered'
      case 'at-risk':
        return 'Needs Water'
      case 'reviving':
        return 'Sprouting'
      default:
        return status
    }
  }
  return (
    <div className="min-h-screen bg-cream font-sans">
      {/* Navigation - Floating Organic Bar */}
      <nav className="fixed w-full z-50 pt-6 px-4">
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md rounded-full shadow-organic border border-forest-100 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-forest-100 p-2 rounded-full">
              <Leaf className="w-5 h-5 text-forest-600 fill-forest-600" />
            </div>
            <span className="text-xl font-bold text-forest-800 tracking-tight">Project Phoenix</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-forest-600 font-medium">
            <Link href="/explore" className="hover:text-forest-800 transition-colors">Explore</Link>
            <Link href="#" className="hover:text-forest-800 transition-colors">Community</Link>
            <Link href="#" className="hover:text-forest-800 transition-colors">Resources</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button className="rounded-full bg-forest-700 hover:bg-forest-800 text-white px-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 overflow-hidden relative">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-mint-light/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-forest-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 -z-10"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint-100 text-forest-700 border border-mint-200 mb-8 animate-fade-in">
            <Sprout className="w-4 h-4" />
            <span className="text-sm font-semibold">The season of revival is here</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-forest-900 mb-8 leading-[1.1] animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Revive. Restore. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 to-mint-dark">Contribute.</span>
          </h1>

          <p className="text-xl text-forest-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Don't let good code wither away. Join our community of developers dedicated to nurturing abandoned projects back to health.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/explore">
              <Button size="lg" className="rounded-full h-14 px-8 bg-forest-700 hover:bg-forest-800 text-white text-lg gap-2 shadow-lg shadow-forest-700/20 hover:shadow-xl hover:scale-105 transition-all">
                Explore The Garden
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="rounded-full h-14 px-8 border-2 border-forest-100 text-forest-700 hover:bg-forest-50 hover:border-forest-200 text-lg">
                Join Movement
              </Button>
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="flex justify-center gap-12 mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <p className="text-3xl font-bold text-forest-800">{stats.totalRepos}+</p>
              <p className="text-forest-500 text-sm">Seeds Planted</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-forest-800">{stats.totalUsers}+</p>
              <p className="text-forest-500 text-sm">Gardeners</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-forest-800">{stats.activeRevivals}</p>
              <p className="text-forest-500 text-sm">Full Revivals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Section / Card Showcase */}
      <section className="py-24 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-forest-900 mb-4">Featured Projects</h2>
            <p className="text-forest-500 text-lg">Withered projects waiting for your care</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-forest-700" />
              </div>
            ) : featuredRepos.length > 0 ? (
              featuredRepos.map((repo) => (
                <Card key={repo.id} className="organic-card border-none bg-white shadow-organic hover:shadow-organic-hover group">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-mint-100 rounded-2xl group-hover:bg-mint-200 transition-colors">
                        <Code2 className="w-6 h-6 text-forest-700" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(repo.abandonment_status)}`}>
                        {getStatusLabel(repo.abandonment_status)}
                      </span>
                    </div>
                    <CardTitle className="text-2xl text-forest-800">{repo.name}</CardTitle>
                    <CardDescription className="text-forest-400">
                      {repo.last_commit_at ? `Last commit ${new Date(repo.last_commit_at).toLocaleDateString()}` : 'Recently added'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-forest-600 mb-6 line-clamp-2">
                      {repo.description || 'No description available'}
                    </p>
                    {repo.maintenance_score !== null && (
                      <>
                        <div className="w-full bg-forest-100 rounded-full h-2 mb-2">
                          <div
                            className="bg-forest-500 h-2 rounded-full"
                            style={{ width: `${repo.maintenance_score}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-forest-500 mb-6">
                          <span>Maintenance Score</span>
                          <span>{repo.maintenance_score}%</span>
                        </div>
                      </>
                    )}
                    <Link href={`/repositories/${repo.id}`}>
                      <Button className="w-full rounded-xl bg-forest-50 text-forest-700 hover:bg-forest-100 border border-forest-100 font-semibold h-12">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-forest-600 mb-4">No repositories yet. Be the first to import one!</p>
                <Link href="/explore">
                  <Button className="rounded-full bg-forest-700 hover:bg-forest-800 text-white px-6">
                    Import Repository
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/explore">
              <Button variant="link" className="text-forest-600 text-lg hover:text-forest-800">
                Explore all projects <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-24 px-4 bg-forest-900 text-cream relative overflow-hidden">
        {/* Decorative foliage */}
        <div className="absolute top-0 left-0 text-forest-800 opacity-20 transform -translate-x-1/4 -translate-y-1/4">
          <Leaf className="w-96 h-96" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-800 text-mint mb-8">
                <Sun className="w-4 h-4" />
                <span className="text-sm font-semibold">Our Methodology</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">How We Cultivate Success</h2>
              <p className="text-forest-200 text-lg mb-8 leading-relaxed">
                Software doesn't have to die. Like a garden, it just needs the right conditions to thrive again. Our platform connects "withered" repos with eager new "gardeners."
              </p>

              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-forest-800 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-mint" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Assess Health</h3>
                    <p className="text-forest-300">Our AI analyzes repo activity to calculate a "Revival Score", identifying the most viable candidates.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-forest-800 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-mint" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Form Revival Squads</h3>
                    <p className="text-forest-300">Don't work alone. Join a team of designers, developers, and writers to share the load.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-forest-800 flex items-center justify-center shrink-0">
                    <Recycle className="w-6 h-6 text-mint" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Sustain Growth</h3>
                    <p className="text-forest-300">Once active, we help transition the project to long-term governance models.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative">
              <Card className="bg-forest-800 border-none p-8 rounded-3xl shadow-2xl relative z-10 rotate-3">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white/10"></div>
                  <div>
                    <div className="h-4 w-32 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 w-20 bg-white/10 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="h-3 w-full bg-white/5 rounded"></div>
                  <div className="h-3 w-full bg-white/5 rounded"></div>
                  <div className="h-3 w-2/3 bg-white/5 rounded"></div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-24 bg-mint text-forest-900 rounded-xl flex items-center justify-center font-bold text-sm">Adopt</div>
                  <div className="h-10 w-24 border border-white/20 rounded-xl"></div>
                </div>
              </Card>
              <div className="absolute top-0 left-0 w-full h-full bg-mint opacity-20 rounded-3xl -rotate-3 transform -translate-x-4 -translate-y-4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-950 pt-20 pb-10 px-4 text-forest-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="w-6 h-6 text-mint" />
              <span className="text-2xl font-bold text-white">Project Phoenix</span>
            </div>
            <p className="max-w-md text-forest-400 mb-8">
              Cultivating the open, digital commons. We believe every line of code deserves a chance to grow.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="text-forest-400 hover:text-white hover:bg-forest-900 rounded-full">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-forest-400 hover:text-white hover:bg-forest-900 rounded-full">
                <Users className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="hover:text-mint transition-colors">Browse Projects</Link></li>
              <li><Link href="#" className="hover:text-mint transition-colors">Revival Squads</Link></li>
              <li><Link href="#" className="hover:text-mint transition-colors">Success Stories</Link></li>
              <li><Link href="#" className="hover:text-mint transition-colors">Pricing for Orgs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Community</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="hover:text-mint transition-colors">Contribution Guide</Link></li>
              <li><Link href="#" className="hover:text-mint transition-colors">Code of Conduct</Link></li>
              <li><Link href="#" className="hover:text-mint transition-colors">Events & Hackathons</Link></li>
              <li><Link href="#" className="hover:text-mint transition-colors">Discord Server</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-forest-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2026 Project Phoenix. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
