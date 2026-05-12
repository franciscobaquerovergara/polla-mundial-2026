'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Profile, BonusType } from '@/types'
import { BONUS_LABELS } from '@/types'
import Navbar from '@/components/Navbar'

interface BonusResult {
  bonus_type: BonusType
  result: string | null
  points_value: number
  is_resolved: boolean
}

export default function AdminBonusesPage() {
  const [adminProfile, setAdminProfile] = useState<Profile | null>(null)
  const [bonusResults, setBonusResults] = useState<BonusResult[]>([])
  const [inputs, setInputs] = useState<Partial<Record<BonusType, string>>>({})
  const [saving, setSaving] = useState<BonusType | null>(null)
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
      await loadBonuses()
      setLoading(false)
    }
    load()
  }, [])

  async function loadBonuses() {
    const { data } = await supabase.from('bonus_results').select('*').order('bonus_type')
    if (data) {
      setBonusResults(data as BonusResult[])
      const existing: Partial<Record<BonusType, string>> = {}
      data.forEach((b: BonusResult) => {
        if (b.result) existing[b.bonus_type] = b.result
      })
      setInputs(existing)
    }
  }

  async function saveBonus(bonusType: BonusType) {
    const value = inputs[bonusType]?.trim()
    if (!value) return

    setSaving(bonusType)

    // 1. Guardar resultado
    const { error } = await supabase.from('bonus_results').upsert({
      bonus_type: bonusType,
      result: value,
      is_resolved: true,
      resolved_at: new Date().toISOString(),
    }, { onConflict: 'bonus_type' })

    if (error) {
      alert('Error: ' + error.message)
      setSaving(null)
      return
    }

    // 2. Calcular puntos a todos los que predijeron correctamente
    const { data: correctPreds } = await supabase
      .from('bonus_predictions')
      .select('id, user_id')
      .eq('bonus_type', bonusType)
      .ilike('prediction', value)

    const meta = BONUS_LABELS[bonusType]
    if (correctPreds && correctPreds.length > 0) {
      for (const pred of correctPreds) {
        await supabase
          .from('bonus_predictions')
          .update({ points_awarded: meta.points })
          .eq('id', pred.id)
      }
    }

    // 3. Poner 0 pts a los que no acertaron
    await supabase
      .from('bonus_predictions')
      .update({ points_awarded: 0 })
      .eq('bonus_type', bonusType)
      .not('prediction', 'ilike', value)

    await loadBonuses()
    setSaving(null)
  }

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar profile={adminProfile} />

      <main className="max-w-3xl mx-auto px-4 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-gray-500 hover:text-white">⚙️ Admin</Link>
          <span className="text-gray-600">/</span>
          <h1 className="text-xl font-bold text-white">🌟 Resolver Bonos del Torneo</h1>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-4 mb-6 text-sm text-yellow-300">
          ⚠️ Al ingresar el resultado de un bono, los puntos se asignan automáticamente a todos los que acertaron.
          La comparación es case-insensitive. Verifica bien el nombre antes de guardar.
        </div>

        <div className="space-y-4">
          {bonusResults.map(bonus => {
            const meta = BONUS_LABELS[bonus.bonus_type]

            // Contar cuántos predijeron este bono
            return (
              <div key={bonus.bonus_type} className={`card p-5 ${bonus.is_resolved ? 'border-green-800/40' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{meta.emoji}</span>
                      <h3 className="text-white font-bold">{meta.label}</h3>
                      {bonus.is_resolved && <span className="badge-confirmed">✅ Resuelto</span>}
                    </div>
                    <p className="text-gray-400 text-sm">{meta.description}</p>
                  </div>
                  <span className="text-green-400 font-bold">{meta.points} pts</span>
                </div>

                {bonus.is_resolved ? (
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 text-sm">Resultado guardado: </span>
                      <span className="text-white font-bold">{bonus.result}</span>
                    </div>
                    <button
                      onClick={() => {
                        setInputs(p => ({ ...p, [bonus.bonus_type]: bonus.result ?? '' }))
                        // Marcar como no resuelto para editar
                        setBonusResults(br => br.map(b =>
                          b.bonus_type === bonus.bonus_type ? { ...b, is_resolved: false } : b
                        ))
                      }}
                      className="text-xs text-gray-500 hover:text-white"
                    >
                      Editar
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputs[bonus.bonus_type] ?? ''}
                      onChange={e => setInputs(p => ({ ...p, [bonus.bonus_type]: e.target.value }))}
                      className="input-field flex-1"
                      placeholder={`Ingresa el ${meta.label.toLowerCase()} oficial`}
                    />
                    <button
                      onClick={() => saveBonus(bonus.bonus_type)}
                      disabled={saving === bonus.bonus_type || !inputs[bonus.bonus_type]}
                      className="btn-primary px-4 py-2 disabled:opacity-40"
                    >
                      {saving === bonus.bonus_type ? '...' : '💾 Guardar'}
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
