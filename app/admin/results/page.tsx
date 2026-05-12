'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Match, Profile } from '@/types'
import { STAGE_LABELS } from '@/types'
import Navbar from '@/components/Navbar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function AdminResultsPage() {
  const [adminProfile, setAdminProfile] = useState<Profile | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [activeStage, setActiveStage] = useState('group')
  const [activeGroup, setActiveGroup] = useState('A')
  const [results, setResults] = useState<Record<number, { home: string; away: string }>>({})
  const [savingId, setSavingId] = useState<number | null>(null)
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!prof?.is_admin) { router.push('/dashboard'); return }

      setAdminProfile(prof)
      await loadMatches()
      setLoading(false)
    }
    load()
  }, [])

  async function loadMatches() {
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(id,name,flag),
        away_team:teams!away_team_id(id,name,flag)
      `)
      .order('match_number', { ascending: true })

    if (data) {
      setMatches(data as Match[])
      // Pre-llenar resultados ya ingresados
      const existing: Record<number, { home: string; away: string }> = {}
      const existingIds = new Set<number>()
      data.forEach((m: Match) => {
        if (m.is_played && m.home_score !== undefined && m.away_score !== undefined) {
          existing[m.id] = { home: String(m.home_score), away: String(m.away_score) }
          existingIds.add(m.id)
        }
      })
      setResults(existing)
      setSavedIds(existingIds)
    }
  }

  async function saveResult(match: Match) {
    const res = results[match.id]
    if (!res || res.home === '' || res.away === '') return

    setSavingId(match.id)

    // 1. Guardar resultado y marcar como jugado
    const { error: matchError } = await supabase
      .from('matches')
      .update({
        home_score: parseInt(res.home),
        away_score: parseInt(res.away),
        is_played: true,
        predictions_locked: true,
      })
      .eq('id', match.id)

    if (matchError) {
      alert('Error al guardar: ' + matchError.message)
      setSavingId(null)
      return
    }

    // 2. Calcular y guardar puntos de todas las predicciones
    const { error: scoreError } = await supabase.rpc('score_match', { p_match_id: match.id })

    if (scoreError) {
      console.error('Error al calcular puntos:', scoreError)
    }

    setSavedIds(s => new Set(s).add(match.id))
    setSavingId(null)
  }

  async function lockMatch(matchId: number) {
    await supabase.from('matches').update({ predictions_locked: true }).eq('id', matchId)
    await loadMatches()
  }

  const STAGES = ['group', 'round_of_32', 'round_of_16', 'quarterfinal', 'semifinal', 'third_place', 'final']
  const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L']

  const filteredMatches = matches.filter(m => {
    if (activeStage === 'group') return m.stage === 'group' && m.group_name === activeGroup
    return m.stage === activeStage
  })

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar profile={adminProfile} />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-gray-500 hover:text-white">⚙️ Admin</Link>
          <span className="text-gray-600">/</span>
          <h1 className="text-xl font-bold text-white">⚽ Ingresar Resultados</h1>
        </div>

        <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-4 mb-6 text-sm text-blue-300">
          💡 Al guardar un resultado, los puntos de todos los participantes se calculan automáticamente.
        </div>

        {/* Selector de ronda */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {STAGES.map(stage => (
            <button key={stage} onClick={() => setActiveStage(stage)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all
                ${activeStage === stage ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {STAGE_LABELS[stage as keyof typeof STAGE_LABELS]}
            </button>
          ))}
        </div>

        {activeStage === 'group' && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
            {GROUPS.map(g => (
              <button key={g} onClick={() => setActiveGroup(g)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all
                  ${activeGroup === g ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {g}
              </button>
            ))}
          </div>
        )}

        {/* Partidos */}
        <div className="space-y-4">
          {filteredMatches.map(match => {
            const res = results[match.id]
            const isSaved = savedIds.has(match.id) || match.is_played
            const isSaving = savingId === match.id

            return (
              <div key={match.id} className={`card p-4 ${isSaved ? 'border-green-800/40' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-gray-500">
                    Partido #{match.match_number} · {match.city}
                    <br />
                    {format(new Date(match.match_date), "d MMM yyyy, HH:mm", { locale: es })}
                  </div>
                  <div className="flex items-center gap-2">
                    {!match.predictions_locked && !match.is_played && (
                      <button onClick={() => lockMatch(match.id)}
                        className="text-xs bg-orange-800 hover:bg-orange-700 text-orange-200 px-2 py-1 rounded-lg">
                        🔒 Cerrar predicciones
                      </button>
                    )}
                    {match.predictions_locked && !match.is_played && (
                      <span className="text-xs text-orange-400">🔒 Predicciones cerradas</span>
                    )}
                    {match.is_played && (
                      <span className="badge-confirmed">✅ Jugado</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <div className="text-center flex-1">
                    <div className="text-2xl">{match.home_team?.flag ?? '🏳️'}</div>
                    <div className="text-sm text-white font-medium mt-1">
                      {match.home_team?.name ?? match.home_team_label ?? 'TBD'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number" min="0" max="30"
                      value={res?.home ?? (match.is_played ? String(match.home_score) : '')}
                      onChange={e => setResults(r => ({
                        ...r, [match.id]: { home: e.target.value, away: r[match.id]?.away ?? '' }
                      }))}
                      className="w-14 bg-gray-800 border-2 border-gray-600 rounded-lg text-center text-2xl font-bold text-white p-2 focus:outline-none focus:border-green-500"
                      placeholder="0"
                    />
                    <span className="text-gray-500 font-bold text-xl">–</span>
                    <input
                      type="number" min="0" max="30"
                      value={res?.away ?? (match.is_played ? String(match.away_score) : '')}
                      onChange={e => setResults(r => ({
                        ...r, [match.id]: { home: r[match.id]?.home ?? '', away: e.target.value }
                      }))}
                      className="w-14 bg-gray-800 border-2 border-gray-600 rounded-lg text-center text-2xl font-bold text-white p-2 focus:outline-none focus:border-green-500"
                      placeholder="0"
                    />
                  </div>

                  <div className="text-center flex-1">
                    <div className="text-2xl">{match.away_team?.flag ?? '🏳️'}</div>
                    <div className="text-sm text-white font-medium mt-1">
                      {match.away_team?.name ?? match.away_team_label ?? 'TBD'}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => saveResult(match)}
                    disabled={isSaving || !results[match.id]?.home || !results[match.id]?.away}
                    className={`text-sm px-5 py-2 rounded-lg font-medium transition-all
                      ${isSaved ? 'bg-green-800 text-green-200 hover:bg-green-700' : 'btn-primary'}
                      disabled:opacity-40`}
                  >
                    {isSaving ? 'Calculando puntos...' : isSaved ? '✓ Guardado y puntuado' : '💾 Guardar resultado'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
