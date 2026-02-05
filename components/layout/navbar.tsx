'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Leaf, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <>
            <nav className="fixed w-full z-50 pt-6 px-4">
                <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md rounded-full shadow-organic border border-forest-100 px-6 py-3 flex justify-between items-center relative">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="bg-forest-100 p-2 rounded-full">
                            <Leaf className="w-5 h-5 text-forest-600 fill-forest-600" />
                        </div>
                        <Link href="/" className="text-xl font-bold text-forest-800 tracking-tight">Project Phoenix</Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8 text-forest-600 font-medium">
                        <Link href="/explore" className="hover:text-forest-800 transition-colors">Explore</Link>
                        <Link href="#" className="hover:text-forest-800 transition-colors">Community</Link>
                        <Link href="#" className="hover:text-forest-800 transition-colors">Resources</Link>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/auth/login">
                            <Button className="rounded-full bg-forest-700 hover:bg-forest-800 text-white px-6">
                                Sign In
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-forest-700 hover:bg-forest-100 rounded-full transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white pt-32 px-6 md:hidden animate-in fade-in slide-in-from-top-10 duration-200">
                    <div className="flex flex-col gap-6 text-xl text-forest-800 font-medium text-center">
                        <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)}>Explore</Link>
                        <Link href="#" onClick={() => setIsMobileMenuOpen(false)}>Community</Link>
                        <Link href="#" onClick={() => setIsMobileMenuOpen(false)}>Resources</Link>
                        <hr className="border-forest-100" />
                        <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button className="w-full rounded-full bg-forest-700 hover:bg-forest-800 text-white py-6 text-lg">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}
