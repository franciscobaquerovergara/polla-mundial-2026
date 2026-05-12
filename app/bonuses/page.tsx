'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Navbar from '@/components/Navbar'
import type { Profile, BonusPrediction, BonusResult, BonusType } from '@/types'
import { BONUS_LABELS } from '@/types'

const ADICTOS_PLAYERS = [
  'Santiago Zapata Gómez', 'Juan Pablo Restrepo', 'Juan Pablo Salazar',
  'Francisco Baquero', 'Edgar Camilo Plazas', 'Andrés López González',
  'Mario Castro', 'Pablo Gutiérrez',
  // Agrega más jugadores Adictos aquí
]

const TEAMS_2026 = [
  'Argentina', 'Francia', 'Brasil', 'España', 'Inglaterra', 'Portugal',
  'Alemania', 'Países Bajos', 'Bélgica', 'Uruguay', 'Colombia', 'México',
  'Marruecos', 'Japón', 'Corea del Sur', 'Croacia', 'Suiza', 'Senegal',
  'Ecuador', 'Australia', 'Turquía', 'Austria', 'Noruega', 'Suecia',
  'Estados Unidos', 'Canadá', 'Dinamarca', 'Polonia',
  'Irán', 'Arabia Saudita', 'Sudáfrica', 'Ghana', 'Nigeria', 'Egipto',
  'Costa de Marfil', 'Rep. Dem. Congo', 'Argelia', 'Túnez', 'Marruecos', 'Senegal',
  'Qatar', 'Haití', 'Bosnia y Herz.', 'Panamá', 'Chequia', 'Nueva Zelanda',
  'Uzbekistán', 'Jordania', 'Irak', 'Curazao', 'Cabo Verde'
]

export default function BonusesPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [myPredictions, setMyPredictions] = useState<Partial<Record<BonusType, string>>>({})
  const [bonusResults, setBonusResults] = useState<BonusResult[]>([])
  const [inputs, setInputs] = useState<Partial<Record<BonusType, string>>>({})
  const [saving, setSaving] = useState<BonusType | null>(null)
  const [saved, setSaved] = useState<Set<BonusType>>(new Set())
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: prof }, { data: myPreds }, { data: results }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('bonus_predictions').select('*').eq('user_id', user.id),
        supabase.from('bonus_results').select('*'),
      ])

      setProfile(prof)

      if (myPreds) {
        const existing: Partial<Record<BonusType, string>> = {}
        const savedSet = new Set<BonusType>()
        myPreds.forEach((p: BonusPrediction) => {
          existing[p.bonus_type] = p.prediction
          savedSet.add(p.bonus_type)
        })
        setMyPredictions(existing)
        setInputs(existing)
        setSaved(savedSet)
      }

      if (results) setBonusResults(results as BonusResult[])
      setLoading(false)
    }
    load()
  }, [supabase])

  async function saveBonusPrediction(bonusType: BonusType) {
    const value = inputs[bonusType]?.trim()
    if (!value) return

    setSaving(bonusType)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('bonus_predictions').upsert({
      user_id: user.id,
      bonus_type: bonusType,
      prediction: value,
    }, { onConflict: 'user_id,bonus_type' })

    if (!error) {
      setMyPredictions(p => ({ ...p, [bonusType]: value }))
      setSaved(s => new Set(s).add(bonusType))
    }
    setSaving(null)
  }

  const bonusResultsMap = Object.fromEntries(
    bonusResults.map(r => [r.bonus_type, r])
  ) as Partial<Record<BonusType, BonusResult>>

  const bonusTypes = Object.keys(BONUS_LABELS) as BonusType[]

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400">Cargando bonos...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar profile={profile} />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <h1 className="text-2xl font-black text-white mb-2">🌟 Predicciones de Bonos</h1>
        <p className="text-gray-400 text-sm mb-6">
          Estas predicciones se cierran al inicio del primer partido del Mundial.
          ¡Una sola oportunidad!
        </p>

        <div className="space-y-4">
          {bonusTypes.map(bonusType => {
            const meta = BONUS_LABELS[bonusType]
            const result = bonusResultsMap[bonusType]
            const myPred = myPredictions[bonusType]
            const isSaved = saved.has(bonusType)
            const isSaving = saving === bonusType
            const isResolved = result?.is_resolved

            const wonPoints = isResolved && myPred && result?.result
              ? myPred.toLowerCase().trim() === result.result.toLowerCase().trim()
                ? meta.points
                : 0
              : null

            return (
              <div key={bonusType}
                className={`card p-5 transition-all
                  ${isSaved ? 'border-green-800/50' : ''}
                  ${isResolved && wonPoints && wonPoints > 0 ? 'border-yellow-700/50' : ''}`}>

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{meta.emoji}</span>
                      <h3 className="text-white font-bold">{meta.label}</h3>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{meta.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{meta.points} pts</div>
                    {wonPoints !== null && (
                      <div className={`text-xs font-bold mt-1 ${wonPoints > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
                        {wonPoints > 0 ? `+${wonPoints} pts ⭐` : '0 pts'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Resultado oficial (si hay) */}
                {isResolved && (
                  <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3 mb-3 text-sm">
                    <span className="text-yellow-400 font-semibold">Resultado oficial: </span>
                    <span className="text-white">{result?.result}</span>
                  </div>
                )}

                {/* Input o resultado guardado */}
                {!isResolved && (
                  <div className="flex gap-3">
                    {bonusType === 'worst_adicto' ? (
                      <select
                        value={inputs[bonusType] ?? ''}
                        onChange={e => setInputs(p => ({ ...p, [bonusType]: e.target.value }))}
                        className="input-field flex-1"
                      >
                        <option value="">— Selecciona el peor Adicto —</option>
                        {ADICTOS_PLAYERS.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    ) : bonusType === 'champion' || bonusType === 'last_team' ? (
                      <select
                        value={inputs[bonusType] ?? ''}
                        onChange={e => setInputs(p => ({ ...p, [bonusType]: e.target.value }))}
                        className="input-field flex-1"
                      >
                        <option value="">— Selecciona un equipo —</option>
                        {TEAMS_2026.sort().map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={inputs[bonusType] ?? ''}
                        onChange={e => setInputs(p => ({ ...p, [bonusType]: e.target.value }))}
                        className="input-field flex-1"
                        placeholder={
                          bonusType === 'golden_boot' ? 'Ej: Kylian Mbappé' :
                          bonusType === 'golden_glove' ? 'Ej: Emiliano Martínez' :
                          'Ej: Bukayo Saka'
                        }
                      />
                    )}
                    <button
                      onClick={() => saveBonusPrediction(bonusType)}
                      disabled={isSaving || !inputs[bonusType]}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${isSaved ? 'bg-green-800 text-green-200 hover:bg-green-700' : 'btn-primary'}
                        disabled:opacity-40`}
                    >
                      {isSaving ? '...' : isSaved ? '✓ Guardado' : 'Guardar'}
                    </button>
                  </div>
                )}

                {isResolved && myPred && (
                  <div className="text-sm text-gray-400">
                    Tu predicción: <span className="text-white font-medium">{myPred}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 card p-4 border-yellow-800/30">
          <p className="text-yellow-300 text-sm font-medium mb-1">⚠️ Importante</p>
          <p className="text-gray-400 text-sm">
            Las predicciones de bonos se comparan tal cual (sin distinción de mayúsculas).
            Para jugadores, usa el nombre completo como aparece en UEFA/FIFA.
            El admin tiene la palabra final en caso de empate o ambigüedad.
          </p>
        </div>
      </main>
    </div>
  )
}
