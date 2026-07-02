'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { ProblemMeta, Difficulty } from '@/lib/problems'
import DifficultyBadge from './DifficultyBadge'
import AdUnit from './AdUnit'
import PopularProblems from './PopularProblems'

const ROW_H = 48   // px — must match the rendered row height
const OVERSCAN = 5 // extra rows rendered above/below the visible window

function VirtualTable({ items, explanationNums }: { items: ProblemMeta[]; explanationNums: Set<number> }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerH, setContainerH] = useState(600)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setContainerH(el.clientHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const totalH = items.length * ROW_H
  const firstVisible = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN)
  const lastVisible  = Math.min(items.length - 1, Math.ceil((scrollTop + containerH) / ROW_H) + OVERSCAN)
  const paddingTop   = firstVisible * ROW_H
  const paddingBot   = Math.max(0, (items.length - lastVisible - 1) * ROW_H)
  const visible      = items.slice(firstVisible, lastVisible + 1)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
      {/* Sticky header */}
      <div className="grid grid-cols-[3.5rem_1fr_7rem_2rem] border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/80 sticky top-0 z-10">
        <span className="px-4 py-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">#</span>
        <span className="px-4 py-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Title</span>
        <span className="px-4 py-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Difficulty</span>
        <span className="pr-4 py-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider" title="Has full explanation" />
      </div>

      {/* Scrollable body */}
      <div
        ref={containerRef}
        className="overflow-y-auto"
        style={{ height: Math.min(totalH, 640) }}
        onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: totalH, position: 'relative' }}>
          <div style={{ position: 'absolute', top: paddingTop, left: 0, right: 0 }}>
            {visible.map(p => (
              <div
                key={p.slug}
                className="grid grid-cols-[3.5rem_1fr_7rem_2rem] border-b border-gray-50 dark:border-gray-800/60 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors group"
                style={{ height: ROW_H }}
              >
                <span className="px-4 flex items-center text-gray-400 dark:text-gray-500 tabular-nums font-mono text-xs">{p.number}</span>
                <span className="px-4 flex items-center">
                  <Link
                    href={`/problems/${p.slug}`}
                    className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate text-sm"
                  >
                    {p.title}
                  </Link>
                </span>
                <span className="px-4 flex items-center">
                  <DifficultyBadge difficulty={p.difficulty} />
                </span>
                <span className="pr-4 flex items-center justify-center">
                  {explanationNums.has(p.number) && (
                    <span title="Full explanation available" className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 flex-shrink-0" />
                  )}
                </span>
              </div>
            ))}
            <div style={{ height: paddingBot }} />
          </div>
        </div>
      </div>
    </div>
  )
}

type Filter = 'All' | Difficulty

const FILTERS: Filter[] = ['All', 'Easy', 'Medium', 'Hard']

const filterActive: Record<Filter, string> = {
  All:     'bg-indigo-600   border-indigo-600   text-white',
  Easy:    'bg-emerald-500  border-emerald-500  text-white',
  Medium:  'bg-amber-500    border-amber-500    text-white',
  Hard:    'bg-red-500      border-red-500      text-white',
  Unknown: 'bg-gray-500     border-gray-500     text-white',
}

export default function ProblemList({
  problems,
  explanationNums = new Set<number>(),
  popularProblems = [],
}: {
  problems: ProblemMeta[]
  explanationNums?: Set<number>
  popularProblems?: ProblemMeta[]
}) {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [search, setSearch] = useState(initialQuery)
  const [filter, setFilter] = useState<Filter>('All')
  // Delay virtual scrolling until after hydration so all links are in the
  // server-rendered HTML (visible to Google and other crawlers).
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => { setSearch(initialQuery) }, [initialQuery])

  const { easy, medium, hard } = useMemo(() => ({
    easy:   problems.filter(p => p.difficulty === 'Easy').length,
    medium: problems.filter(p => p.difficulty === 'Medium').length,
    hard:   problems.filter(p => p.difficulty === 'Hard').length,
  }), [problems])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return problems.filter(p => {
      const matchSearch =
        !term ||
        p.title.toLowerCase().includes(term) ||
        String(p.number).includes(term)
      const matchFilter = filter === 'All' || p.difficulty === filter
      return matchSearch && matchFilter
    })
  }, [problems, search, filter])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 px-6 py-10 mb-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_55%)] pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Updated daily
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            LeetCode <span className="text-indigo-200">C# Solutions</span>
          </h1>
          <p className="text-indigo-200 text-sm sm:text-base mb-8 max-w-xl">
            Clean, readable C# solutions for .NET developers preparing for coding interviews.
            {explanationNums.size}+ problems include full step-by-step explanations; all solutions include approach notes and complexity where available.
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex gap-8 flex-wrap">
              <Stat value={problems.length} label="Solved"  />
              <Stat value={explanationNums.size} label="Explained" dim />
              <Stat value={easy}            label="Easy"    dim />
              <Stat value={medium}          label="Medium"  dim />
              <Stat value={hard}            label="Hard"    dim />
            </div>
            <div className="flex flex-wrap gap-2">
              <QuickLink href="/study-guide" label="Study Guide" />
              <QuickLink href="/system-design" label="System Design" violet />
              <QuickLink href="/cheat-sheet" label="C# Cheat Sheet" />
              <QuickLink href="/topics"      label="Topics" />
              <QuickLink href="/gfg"         label="GFG Java" emerald />
            </div>
          </div>
        </div>
      </section>

      <PopularProblems problems={popularProblems} />

      {/* AdSense */}
        <AdUnit slot="4545599910" style="leaderboard" className="mb-6" />

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by number or title…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                filter === f
                  ? filterActive[f]
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 tabular-nums flex items-center gap-3">
        <span>{filtered.length} problem{filtered.length !== 1 ? 's' : ''}</span>
        <span className="flex items-center gap-1 text-indigo-400 dark:text-indigo-500">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 inline-block" />
          Full explanation available
        </span>
      </p>

      {/* Problem table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>No problems match your search.</p>
        </div>
      ) : mounted ? (
        <VirtualTable items={filtered} explanationNums={explanationNums} />
      ) : (
        /* SSR fallback: full list so all links are in the initial HTML for crawlers */
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
          <div className="grid grid-cols-[3.5rem_1fr_7rem_2rem] border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/80">
            <span className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">#</span>
            <span className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Title</span>
            <span className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Difficulty</span>
            <span className="pr-4 py-3" />
          </div>
          {filtered.map(p => (
            <div key={p.slug} className="grid grid-cols-[3.5rem_1fr_7rem_2rem] border-b border-gray-50 dark:border-gray-800" style={{ height: ROW_H }}>
              <span className="px-4 flex items-center text-gray-400 tabular-nums font-mono text-xs">{p.number}</span>
              <span className="px-4 flex items-center">
                <Link href={`/problems/${p.slug}`} className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{p.title}</Link>
              </span>
              <span className="px-4 flex items-center"><DifficultyBadge difficulty={p.difficulty} /></span>
              <span className="pr-4 flex items-center justify-center">
                {explanationNums.has(p.number) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500" />
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function Stat({ value, label, dim }: { value: number; label: string; dim?: boolean }) {
  return (
    <div>
      <div className={`text-2xl font-bold tabular-nums ${dim ? 'text-white/70' : 'text-white'}`}>{value}</div>
      <div className={`text-[11px] uppercase tracking-widest mt-0.5 ${dim ? 'text-white/40' : 'text-white/60'}`}>{label}</div>
    </div>
  )
}

function QuickLink({ href, label, emerald, violet }: { href: string; label: string; emerald?: boolean; violet?: boolean }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        emerald
          ? 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 border border-emerald-400/20'
          : violet
            ? 'bg-violet-500/20 text-violet-100 hover:bg-violet-500/30 border border-violet-400/20'
            : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'
      }`}
    >
      {label}
      <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  )
}
