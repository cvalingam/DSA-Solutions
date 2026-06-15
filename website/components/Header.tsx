'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from './ThemeProvider'

export default function Header() {
  const router   = useRouter()
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const [query, setQuery] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); setMobileSearchOpen(false) }, [pathname])

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && query.trim()) {
      const base = pathname.startsWith('/gfg') ? '/gfg' : '/'
      router.push(`${base}?q=${encodeURIComponent(query.trim())}`)
      setMobileSearchOpen(false)
    }
    if (e.key === 'Escape') { setQuery(''); setMobileSearchOpen(false) }
  }

  function openMobileSearch() {
    setMobileMenuOpen(false)
    setMobileSearchOpen(true)
    setTimeout(() => mobileInputRef.current?.focus(), 50)
  }

  const isLc  = pathname === '/' || pathname.startsWith('/problems')
  const isGfg = pathname.startsWith('/gfg')
  const isSd  = pathname.startsWith('/system-design')

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200/70 dark:border-gray-800/70 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-gray-900 dark:text-gray-100 tracking-tight shrink-0 hover:opacity-80 transition-opacity"
          >
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-[11px] flex items-center justify-center font-black shadow-sm">
              D
            </span>
            <span className="hidden sm:inline">
              DSA <span className="text-indigo-600 dark:text-indigo-400">Solutions</span>
            </span>
            <span className="sm:hidden font-bold">
              DSA <span className="text-indigo-600 dark:text-indigo-400">Solutions</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="relative flex-1 max-w-xs hidden sm:block">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search problems…"
              autoComplete="off"
              aria-label="Search problems"
              className="w-full pl-8 pr-9 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/80 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-gray-300 dark:text-gray-600 font-mono">↵</kbd>
          </div>

          {/* Desktop Nav */}
          <nav className="ml-auto hidden sm:flex items-center gap-0.5 text-sm">
            <NavLink href="/"       active={isLc}  label="LeetCode" />
            <NavLink href="/gfg"    active={isGfg} label="GFG" activeColor="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40" hoverColor="hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30" />
            <NavLink href="/topics"      active={pathname.startsWith('/topics')} label="Topics"      className="hidden md:inline-flex" />
            <NavLink href="/study-guide" active={pathname === '/study-guide'}    label="Study Guide" className="hidden lg:inline-flex" />
            <NavLink href="/system-design" active={isSd} label="System Design" className="hidden lg:inline-flex" activeColor="text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40" hoverColor="hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50/60 dark:hover:bg-violet-950/30" />
            <NavLink href="/cheat-sheet" active={pathname === '/cheat-sheet'}    label="Cheat Sheet" className="hidden xl:inline-flex" />
            <NavLink href="/faq"         active={pathname === '/faq'}            label="FAQ"         className="hidden xl:inline-flex" />
            <NavLink href="/about"       active={pathname === '/about'}          label="About"       className="hidden lg:inline-flex" />
            <a
              href="https://github.com/cvalingam/DSA-Solutions"
              target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              className="ml-1 p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <GitHubIcon />
            </a>
            <button
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </nav>

          {/* Mobile right-side controls */}
          <div className="sm:hidden ml-auto flex items-center gap-1">
            <button onClick={openMobileSearch} aria-label="Search"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
            <button
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(v => !v); setMobileSearchOpen(false) }}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {mobileMenuOpen ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="sm:hidden px-4 pb-3 border-b border-gray-200/70 dark:border-gray-800/70 bg-white/95 dark:bg-gray-950/95">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={mobileInputRef}
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={handleSearch} placeholder="Search problems…" autoComplete="off"
                aria-label="Search problems"
                className="w-full pl-8 pr-9 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all"
              />
              <button onClick={() => { setMobileSearchOpen(false); setQuery('') }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close search">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <nav className="sm:hidden border-b border-gray-200/70 dark:border-gray-800/70 bg-white/98 dark:bg-gray-950/98 backdrop-blur-md">
            <div className="px-4 py-3 space-y-0.5">
              <MobileNavLink href="/"            active={isLc}  label="LeetCode C#" icon="🟦" />
              <MobileNavLink href="/gfg"         active={isGfg} label="GFG Java"    icon="🟩" />
              <MobileNavLink href="/topics"      active={pathname.startsWith('/topics')} label="Topics"      icon="🏷️" />
              <MobileNavLink href="/study-guide" active={pathname === '/study-guide'}    label="Study Guide" icon="📚" />
              <MobileNavLink href="/system-design" active={isSd} label="System Design" icon="🏗️" />
              <MobileNavLink href="/cheat-sheet" active={pathname === '/cheat-sheet'}    label="C# Cheat Sheet" icon="📋" />
              <MobileNavLink href="/faq"         active={pathname === '/faq'}            label="FAQ"         icon="❓" />
              <MobileNavLink href="/about"       active={pathname === '/about'}          label="About"       icon="ℹ️" />
              <MobileNavLink href="/contact"     active={pathname === '/contact'}        label="Contact"     icon="✉️" />
            </div>
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
              <a
                href="https://github.com/cvalingam/DSA-Solutions"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
              >
                <GitHubIcon />
                <span>View on GitHub</span>
                <svg className="w-3 h-3 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  )
}

function NavLink({
  href, active, label, className = '',
  activeColor = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40',
  hoverColor  = 'hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30',
}: {
  href: string; active: boolean; label: string
  className?: string; activeColor?: string; hoverColor?: string
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${className} ${
        active ? activeColor : `text-gray-500 dark:text-gray-400 ${hoverColor}`
      }`}
    >
      {label}
    </Link>
  )
}

function MobileNavLink({ href, active, label, icon }: {
  href: string; active: boolean; label: string; icon: string
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
      }`}
    >
      <span className="text-base leading-none">{icon}</span>
      {label}
    </Link>
  )
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
}
