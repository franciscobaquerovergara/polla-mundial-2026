'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-client'
import Navbar from '@/components/Navbar'
import type { Match, Profile } from '@/types'
import { STAGE_LABELS, STAGE_MULTIPLIERS } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const STAGES = ['group', 'round_of_32', 'round_of_16', 'quarterfinal', 'semifinal', 'third_place', 'final'] as const
const GROUP_NAMES = ['A','B','C','D','E','F','G','H','I','J','K','L']

export default function PredictionsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStage, setActiveStage] = useState<string>('group')
  const [activeGroup, setActiveGroup] = useState<string>('A')
  const [predictions, setPredictions] = useState<Record<number, { home: string; away: string }>>({})
  const [savingId, setSavingId] = useState<number | null>(null)
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())

  const supabase = createClient()

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: prof }, { data: matchData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('matches').select(`
        *,
        home_team:teams!home_team_id(id,name,flag),
        away_team:teams!away_team_id(id,name,flag),
        user_prediction:predictions!left(predicted_home,predicted_away,points_awarded)
      `).eq('predictions.user_id', user.id).order('match_number', { ascending: true }),
    ])

    setProfile(prof)

    if (matchData) {
      const ms = matchData as Match[]
      setMatches(ms)

      // Pre-llenar predicciones existentes
      const existing: Record<number, { home: string; away: string }> = {}
      const existingIds = new Set<number>()
      ms.forEach(m => {
        if (m.user_prediction) {
          existing[m.id] = {
            home: String(m.user_prediction.predicted_home),
            away: String(m.user_prediction.predicted_away),
          }
          existingIds.add(m.id)
        }
      })
      setPredictions(existing)
      setSavedIds(existingIds)
    }

    setLoading(false)
  }, [supabase])

  useEffect(() => { loadData() }, [loadData])

  async function savePrediction(matchId: number) {
    const pred = predictions[matchId]
    if (!pred || pred.home === '' || pred.away === '') return

    setSavingId(matchId)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('predictions').upsert({
      user_id: user.id,
      match_id: matchId,
      predicted_home: parseInt(pred.home),
      predicted_away: parseInt(pred.away),
    }, { onConflict: 'user_id,match_id' })

    if (!error) {
      setSavedIds(s => new Set(s).add(matchId))
    }
    setSavingId(null)
  }

  const filteredMatches = matches.filter(m => {
    if (activeStage === 'group') return m.stage === 'group' && m.group_name === activeGroup
    return m.stage === activeStage
  })

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400 text-lg">Cargando partidos...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar profile={profile} />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <h1 className="text-2xl font-black text-white mb-6">🎯 Mis Predicciones</h1>

        {/* Selector de ronda */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {STAGES.map(stage => (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${activeStage === stage
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              {STAGE_LABELS[stage]}
              <span className="ml-1 text-xs opacity-70">×{STAGE_MULTIPLIERS[stage]}</span>
            </button>
          ))}
        </div>

        {/* Selector de grupo (solo en fase de grupos) */}
        {activeStage === 'group' && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {GROUP_NAMES.map(g => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all
                  ${activeGroup === g
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {/* Lista de partidos */}
        <div className="space-y-4">
          {filteredMatches.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">📅</div>
              <p>No hay partidos en esta categoría todavía</p>
            </div>
          )}

          {filteredMatches.map(match => {
            const pred = predictions[match.id]
            const isSaved = savedIds.has(match.id)
            const isSaving = savingId === match.id
            const isLocked = match.predictions_locked || match.is_played
            const multiplier = STAGE_MULTIPLIERS[match.stage]

            // Calcular puntos potenciales
            const maxPts = Math.floor(8 * multiplier)
            const winnerPts = Math.floor(2 * multiplier)

            return (
              <div key={match.id}
                className={`card p-5 transition-all ${isSaved ? 'border-green-800/50' : ''}`}>

                {/* Header del partido */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`stage-badge text-xs px-2 py-1 rounded-full
                      ${match.stage === 'final' ? 'bg-yellow-800 text-yellow-200' :
                        match.stage === 'group' ? 'bg-blue-900 text-blue-200' :
                        'bg-purple-900 text-purple-200'}`}>
                      {STAGE_LABELS[match.stage]}
                      {match.group_name ? ` · Grupo ${match.group_name}` : ''}
                    </span>
                    <span className="text-xs text-gray-500">Partido #{match.match_number}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {format(new Date(match.match_date), "d MMM, HH:mm", { locale: es })}
                    </div>
                    <div className="text-xs text-green-400">Exacto = {maxPts} pts</div>
                  </div>
                </div>

                {/* Equipos y entrada de predicción */}
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center flex-1">
                    <div className="text-3xl mb-1">{match.home_team?.flag ?? '🏳️'}</div>
                    <div className="text-sm font-medium text-white">
                      {match.home_team?.name ?? match.home_team_label ?? 'TBD'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isLocked ? (
                      <div className="flex items-center gap-2">
                        {match.is_played ? (
                          <>
                            <span className="text-2xl font-black text-white">{match.home_score}</span>
                            <span className="text-gray-500">–</span>
                            <span className="text-2xl font-black text-white">{match.away_score}</span>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm">🔒 Cerrado</span>
                        )}
                      </div>
                    ) : (
                      <>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={pred?.home ?? ''}
                          onChange={e => setPredictions(p => ({
                            ...p, [match.id]: { home: e.target.value, away: p[match.id]?.away ?? '' }
                          }))}
                          className="score-input"
                          placeholder="0"
                        />
                        <span className="text-gray-500 font-bold text-xl">–</span>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={pred?.away ?? ''}
                          onChange={e => setPredictions(p => ({
                            ...p, [match.id]: { home: p[match.id]?.home ?? '', away: e.target.value }
                          }))}
                          className="score-input"
                          placeholder="0"
                        />
                      </>
                    )}
                  </div>

                  <div className="text-center flex-1">
                    <div className="text-3xl mb-1">{match.away_team?.flag ?? '🏳️'}</div>
                    <div className="text-sm font-medium text-white">
                      {match.away_team?.name ?? match.away_team_label ?? 'TBD'}
                    </div>
                  </div>
                </div>

                {/* Resultado y puntos (si ya jugó) */}
                {match.is_played && match.user_prediction && (
                  <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Tu pred: <span className="text-white font-bold">
                        {match.user_prediction.predicted_home} – {match.user_prediction.predicted_away}
                      </span>
                    </span>
                    <span className={`font-bold ${match.user_prediction.points_awarded > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                      {match.user_prediction.points_awarded > 0
                        ? `+${match.user_prediction.points_awarded} pts`
                        : '0 pts'}
                    </span>
                  </div>
                )}

                {/* Botón guardar */}
                {!isLocked && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Ganador correcto = {winnerPts} pts
                    </span>
                    <button
                      onClick={() => savePrediction(match.id)}
                      disabled={isSaving || !pred?.home || !pred?.away}
                      className={`text-sm px-4 py-2 rounded-lg font-medium transition-all
                        ${isSaved
                          ? 'bg-green-800 text-green-200 hover:bg-green-700'
                          : 'bg-green-600 text-white hover:bg-green-500'}
                        disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {isSaving ? '...' : isSaved ? '✓ Guardado' : 'Guardar'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
