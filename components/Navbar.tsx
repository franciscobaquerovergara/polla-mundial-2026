'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import type { Profile } from '@/types'

interface NavbarProps {
  profile?: Profile | null
}

export default function Navbar({ profile }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const links = [
    { href: '/dashboard', label: 'Inicio', emoji: '🏠' },
    { href: '/predictions', label: 'Predicciones', emoji: '🎯' },
    { href: '/bonuses', label: 'Bonos', emoji: '🌟' },
    { href: '/leaderboard', label: 'Tabla', emoji: '📊' },
  ]

  if (profile?.is_admin) {
    links.push({ href: '/admin', label: 'Admin', emoji: '⚙️' })
  }

  return (
    <>
      {/* Top bar */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">⚽</span>
            <span className="font-bold text-white text-sm hidden sm:block">Polla Mundial 2026</span>
          </Link>

          <div className="flex items-center gap-4">
            {profile && (
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-gray-400">Hola,</span>
                <span className="text-white font-medium">{profile.username}</span>
                {profile.payment_status === 'confirmed' && (
                  <span className="badge-confirmed">✓ Activo</span>
                )}
                {profile.payment_status === 'pending' && (
                  <span className="badge-pending">⏳ Pendiente</span>
                )}
              </div>
            )}
            <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm transition-colors">
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Bottom navigation (mobile) / Side nav (desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 md:hidden">
        <div className="flex justify-around py-2">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-col items-center px-3 py-1 text-xs transition-colors
                ${pathname.startsWith(l.href) ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <span className="text-lg">{l.emoji}</span>
              <span>{l.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
