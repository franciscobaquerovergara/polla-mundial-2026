'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Profile } from '@/types'
import Navbar from '@/components/Navbar'

export default function AdminPaymentsPage() {
  const [adminProfile, setAdminProfile] = useState<Profile | null>(null)
  const [players, setPlayers] = useState<Profile[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('pending')
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!prof?.is_admin) { router.push('/dashboard'); return }

      setAdminProfile(prof)
      await loadPlayers()
      setLoading(false)
    }
    load()
  }, [])

  async function loadPlayers() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setPlayers((data ?? []) as Profile[])
  }

  async function updatePaymentStatus(userId: string, status: 'confirmed' | 'rejected') {
    setActionId(userId)
    const { error } = await supabase
      .from('profiles')
      .update({
        payment_status: status,
        payment_date: status === 'confirmed' ? new Date().toISOString() : null,
      })
      .eq('id', userId)

    if (!error) await loadPlayers()
    setActionId(null)
  }

  const filtered = players.filter(p => filter === 'all' || p.payment_status === filter)
  const counts = {
    all: players.length,
    pending: players.filter(p => p.payment_status === 'pending').length,
    confirmed: players.filter(p => p.payment_status === 'confirmed').length,
    rejected: players.filter(p => p.payment_status === 'rejected').length,
  }

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar profile={adminProfile} />

      <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-gray-500 hover:text-white">⚙️ Admin</Link>
          <span className="text-gray-600">/</span>
          <h1 className="text-xl font-bold text-white">💳 Gestión de Pagos</h1>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'pending', 'confirmed', 'rejected'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${filter === f ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {f === 'all' ? 'Todos' : f === 'pending' ? '⏳ Pendientes' : f === 'confirmed' ? '✅ Confirmados' : '❌ Rechazados'}
              <span className="ml-1 bg-gray-700 px-1.5 py-0.5 rounded-full text-xs">{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* Lista de jugadores */}
        <div className="space-y-3">
          {filtered.map(player => (
            <div key={player.id} className={`card p-4 ${player.payment_status === 'pending' ? 'border-yellow-800/40' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold">{player.full_name}</span>
                    <span className="text-gray-500 text-sm">@{player.username}</span>
                    <span className={`badge-${player.payment_status}`}>
                      {player.payment_status === 'pending' ? '⏳ Pendiente' :
                       player.payment_status === 'confirmed' ? '✅ Confirmado' : '❌ Rechazado'}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1"><span className="text-xs">{player.username}</span></div>
                  <div className="text-sm mt-1 space-y-0.5">
                    {player.phone && <span className="text-gray-500 mr-3">📱 {player.phone}</span>}
                    {player.city && <span className="text-gray-500 mr-3">📍 {player.city}</span>}
                    {player.payment_reference && (
                      <span className="text-yellow-300 font-mono text-xs bg-yellow-900/30 px-2 py-0.5 rounded">
                        Coink: {player.payment_reference}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Registrado: {new Date(player.created_at).toLocaleDateString('es-CO')}
                    {player.payment_date && ` · Pago confirmado: ${new Date(player.payment_date).toLocaleDateString('es-CO')}`}
                  </div>
                </div>

                {player.payment_status !== 'confirmed' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updatePaymentStatus(player.id, 'confirmed')}
                      disabled={actionId === player.id}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      {actionId === player.id ? '...' : '✅ Confirmar'}
                    </button>
                    {player.payment_status === 'pending' && (
                      <button
                        onClick={() => updatePaymentStatus(player.id, 'rejected')}
                        disabled={actionId === player.id}
                        className="bg-red-800 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg"
                      >
                        ❌ Rechazar
                      </button>
                    )}
                  </div>
                )}

                {player.payment_status === 'confirmed' && (
                  <button
                    onClick={() => updatePaymentStatus(player.id, 'rejected')}
                    disabled={actionId === player.id}
                    className="text-gray-600 hover:text-red-400 text-xs transition-colors"
                  >
                    Deshacer
                  </button>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-3xl mb-2">✅</div>
              <p>No hay jugadores en esta categoría</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
