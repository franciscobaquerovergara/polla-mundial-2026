import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import type { Match, LeaderboardEntry } from '@/types'
import { STAGE_LABELS } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Próximos partidos (sin jugar, sin predecir aún)
  const { data: upcomingMatches } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(id,name,flag),
      away_team:teams!away_team_id(id,name,flag),
      user_prediction:predictions!inner(predicted_home,predicted_away,points_awarded)
    `)
    .eq('is_played', false)
    .eq('predictions.user_id', user.id)
    .order('match_date', { ascending: true })
    .limit(5)

  // Partidos sin predecir próximos
  const { data: unpredictedMatches } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(id,name,flag),
      away_team:teams!away_team_id(id,name,flag)
    `)
    .eq('is_played', false)
    .eq('predictions_locked', false)
    .not('id', 'in', `(
      select match_id from predictions where user_id = '${user.id}'
    )`)
    .order('match_date', { ascending: true })
    .limit(5)

  // Mis puntos totales
  const { data: myStats } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('id', user.id)
    .single()

  // Posición en el leaderboard
  const leaderboardEntry = myStats as LeaderboardEntry | null

  // Últimos resultados jugados con mi predicción
  const { data: recentResults } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(id,name,flag),
      away_team:teams!away_team_id(id,name,flag),
      user_prediction:predictions!inner(predicted_home,predicted_away,points_awarded)
    `)
    .eq('is_played', true)
    .eq('predictions.user_id', user.id)
    .order('match_date', { ascending: false })
    .limit(5)

  const prizes = {
    total: 300000 * 48,
    champion: Math.floor(300000 * 48 * 0.65),
    secondPlace: Math.floor(300000 * 48 * 0.15),
    firstRound: Math.floor(300000 * 48 * 0.20),
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar profile={profile} />

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">

        {/* Banner de pago pendiente */}
        {profile?.payment_status === 'pending' && (
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4 mb-6 flex items-start gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="text-yellow-300 font-semibold">Pago pendiente de confirmación</p>
              <p className="text-yellow-200/70 text-sm mt-1">
                Tu referencia Coink <span className="font-mono font-bold">{profile.payment_reference}</span> está siendo verificada por el administrador.
                Mientras tanto puedes hacer predicciones, pero no aparecerás en el leaderboard hasta que se confirme.
              </p>
            </div>
          </div>
        )}

        {/* Stats rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 text-center">
            <div className="text-3xl font-black text-green-400">
              {leaderboardEntry?.total_points ?? 0}
            </div>
            <div className="text-gray-400 text-sm mt-1">Puntos totales</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-black text-yellow-400">
              #{leaderboardEntry?.position ?? '—'}
            </div>
            <div className="text-gray-400 text-sm mt-1">Posición actual</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-black text-blue-400">
              {leaderboardEntry?.correct_predictions ?? 0}
            </div>
            <div className="text-gray-400 text-sm mt-1">Exactos / Aciertos</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-black text-purple-400">
              {leaderboardEntry?.total_predictions ?? 0}
            </div>
            <div className="text-gray-400 text-sm mt-1">Predicciones hechas</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Partidos sin predecir */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🎯</span> Predice Ahora
              </h2>
              <Link href="/predictions" className="text-green-400 text-sm hover:text-green-300">
                Ver todos →
              </Link>
            </div>

            {unpredictedMatches && unpredictedMatches.length > 0 ? (
              <div className="space-y-3">
                {(unpredictedMatches as Match[]).map(match => (
                  <Link key={match.id} href={`/predictions?match=${match.id}`}
                    className="block bg-gray-800 hover:bg-gray-750 rounded-lg p-3 transition-colors group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">
                        {STAGE_LABELS[match.stage]} {match.group_name ? `· Grupo ${match.group_name}` : ''}
                      </span>
                      <span className="text-xs text-yellow-400 font-medium">Sin predicción ⚠️</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 py-1">
                      <div className="text-center">
                        <div className="text-lg">{match.home_team?.flag}</div>
                        <div className="text-xs text-gray-300">{match.home_team?.name ?? match.home_team_label}</div>
                      </div>
                      <div className="text-gray-500 font-bold">vs</div>
                      <div className="text-center">
                        <div className="text-lg">{match.away_team?.flag}</div>
                        <div className="text-xs text-gray-300">{match.away_team?.name ?? match.away_team_label}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-1">
                      {format(new Date(match.match_date), "d MMM 'a las' HH:mm", { locale: es })}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-3xl mb-2">✅</div>
                <p>¡Todas las predicciones al día!</p>
              </div>
            )}
          </div>

          {/* Resultados recientes */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>📋</span> Tus Últimos Resultados
              </h2>
            </div>

            {recentResults && recentResults.length > 0 ? (
              <div className="space-y-3">
                {(recentResults as Match[]).map(match => {
                  const pred = match.user_prediction
                  let resultClass = 'prediction-miss'
                  let resultLabel = '—'
                  if (pred) {
                    const predResult = Math.sign(pred.predicted_home - pred.predicted_away)
                    const actResult = Math.sign((match.home_score ?? 0) - (match.away_score ?? 0))
                    if (pred.predicted_home === match.home_score && pred.predicted_away === match.away_score) {
                      resultClass = 'prediction-exact'
                      resultLabel = `⭐ Exacto! +${pred.points_awarded} pts`
                    } else if (predResult === actResult) {
                      resultClass = 'prediction-winner'
                      resultLabel = `✓ Ganador +${pred.points_awarded} pts`
                    } else {
                      resultLabel = '✗ Sin puntos'
                    }
                  }

                  return (
                    <div key={match.id} className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">
                          {match.home_team?.flag} {match.home_team?.name ?? match.home_team_label} vs {match.away_team?.flag} {match.away_team?.name ?? match.away_team_label}
                        </span>
                        <span className={`stage-badge ${resultClass}`}>{resultLabel}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">Resultado: <span className="text-white font-bold">{match.home_score} – {match.away_score}</span></span>
                        {pred && (
                          <span className="text-gray-400">Tu predicción: <span className="text-white font-bold">{pred.predicted_home} – {pred.predicted_away}</span></span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-3xl mb-2">⏳</div>
                <p>Aún no hay partidos jugados</p>
              </div>
            )}
          </div>
        </div>

        {/* Premio info */}
        <div className="card p-5 mt-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>💰</span> Premio Total del Pozo
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-yellow-400 font-black text-xl">
                ${prizes.champion.toLocaleString()}
              </div>
              <div className="text-gray-500 text-xs mt-1">🥇 El Gordo (65%)</div>
            </div>
            <div>
              <div className="text-gray-300 font-black text-xl">
                ${prizes.firstRound.toLocaleString()}
              </div>
              <div className="text-gray-500 text-xs mt-1">🏅 Primer Seco (20%)</div>
            </div>
            <div>
              <div className="text-amber-600 font-black text-xl">
                ${prizes.secondPlace.toLocaleString()}
              </div>
              <div className="text-gray-500 text-xs mt-1">🥈 Segundo Seco (15%)</div>
            </div>
          </div>
          <div className="text-center text-xs text-gray-600 mt-3">
            Total del pozo: ${prizes.total.toLocaleString()} COP · 48 participantes × $300.000
          </div>
        </div>

      </main>
    </div>
  )
}
