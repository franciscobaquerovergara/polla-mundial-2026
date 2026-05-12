import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import type { LeaderboardEntry } from '@/types'

export const revalidate = 60 // revalidar cada 60s

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const { data: entries } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_points', { ascending: false })

  const leaderboard = (entries ?? []) as LeaderboardEntry[]

  const myEntry = leaderboard.find(e => e.id === user.id)

  // Vergonha (últimos 3)
  const vergonha = leaderboard.slice(-3).reverse()

  const prizes = {
    champion: Math.floor(300000 * 48 * 0.65),
    firstRound: Math.floor(300000 * 48 * 0.20),
    secondPlace: Math.floor(300000 * 48 * 0.15),
  }

  function getMedal(pos: number) {
    if (pos === 1) return '🥇'
    if (pos === 2) return '🥈'
    if (pos === 3) return '🥉'
    return null
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar profile={profile} />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <h1 className="text-2xl font-black text-white mb-2">📊 Tabla de Posiciones</h1>
        <p className="text-gray-400 text-sm mb-6">Solo participantes con pago confirmado</p>

        {/* Mi posición */}
        {myEntry && (
          <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-green-400">#{myEntry.position}</div>
              <div>
                <div className="text-white font-bold">Tú — {myEntry.username}</div>
                <div className="text-gray-400 text-sm">{myEntry.match_points} partido + {myEntry.bonus_points} bonos</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-green-400">{myEntry.total_points}</div>
              <div className="text-gray-500 text-xs">puntos</div>
            </div>
          </div>
        )}

        {/* Tabla principal */}
        <div className="card overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Jugador</th>
                  <th className="px-4 py-3 text-right">Partidos</th>
                  <th className="px-4 py-3 text-right">Bonos</th>
                  <th className="px-4 py-3 text-right font-bold text-white">Total</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, idx) => {
                  const medal = getMedal(entry.position)
                  const isMe = entry.id === user.id
                  const isTop3 = entry.position <= 3
                  const isLast3 = idx >= leaderboard.length - 3

                  return (
                    <tr key={entry.id}
                      className={`border-b border-gray-800/50 transition-colors
                        ${isMe ? 'bg-green-900/10' : 'hover:bg-gray-800/50'}
                        ${isLast3 && leaderboard.length > 3 ? 'bg-red-950/20' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {medal ? (
                            <span className="text-xl">{medal}</span>
                          ) : (
                            <span className={`font-mono text-sm ${isLast3 ? 'text-red-400' : 'text-gray-400'}`}>
                              {entry.position}
                            </span>
                          )}
                          {isLast3 && leaderboard.length > 3 && (
                            <span title="Zona de asado">🔥</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className={`font-medium ${isMe ? 'text-green-400' : 'text-white'}`}>
                              {entry.username} {isMe && '(tú)'}
                            </div>
                            {entry.city && (
                              <div className="text-xs text-gray-500">{entry.city}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300">{entry.match_points}</td>
                      <td className="px-4 py-3 text-right text-gray-300">{entry.bonus_points}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-black text-lg ${isTop3 ? 'text-yellow-400' : isMe ? 'text-green-400' : 'text-white'}`}>
                          {entry.total_points}
                        </span>
                      </td>
                    </tr>
                  )
                })}

                {leaderboard.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                      <div className="text-3xl mb-2">⏳</div>
                      El mundial no ha comenzado. ¡Inscríbete!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Premios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {leaderboard[0] && (
            <div className="card p-4 text-center border-yellow-800/30">
              <div className="text-3xl mb-2">🥇</div>
              <div className="text-yellow-400 font-bold">{leaderboard[0].username}</div>
              <div className="text-gray-400 text-xs">Líder actual</div>
              <div className="text-green-400 font-bold mt-1">${prizes.champion.toLocaleString()}</div>
              <div className="text-gray-500 text-xs">El Gordo (65%)</div>
            </div>
          )}
          {leaderboard[1] && (
            <div className="card p-4 text-center">
              <div className="text-3xl mb-2">🥈</div>
              <div className="text-gray-300 font-bold">{leaderboard[1].username}</div>
              <div className="text-gray-400 text-xs">2do lugar</div>
              <div className="text-green-400 font-bold mt-1">${prizes.secondPlace.toLocaleString()}</div>
              <div className="text-gray-500 text-xs">Segundo Seco (15%)</div>
            </div>
          )}
          <div className="card p-4 text-center border-orange-800/30">
            <div className="text-3xl mb-2">🏅</div>
            <div className="text-orange-400 font-bold text-sm">Tras Fase de Grupos</div>
            <div className="text-gray-400 text-xs">Primer Seco</div>
            <div className="text-green-400 font-bold mt-1">${prizes.firstRound.toLocaleString()}</div>
            <div className="text-gray-500 text-xs">20% del pozo</div>
          </div>
        </div>

        {/* Zona Vergonha */}
        {vergonha.length > 0 && leaderboard.length >= 4 && (
          <div className="card p-5 border-red-900/50">
            <h2 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
              <span>🔥</span> Zona Vergonha — Pagan Asado
            </h2>
            <div className="space-y-2">
              {vergonha.map((entry, i) => (
                <div key={entry.id} className="flex items-center justify-between bg-red-950/30 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{i === 0 ? '💀' : i === 1 ? '😰' : '😓'}</span>
                    <div>
                      <div className="text-white font-medium">{entry.username}</div>
                      <div className="text-xs text-gray-500">{entry.city}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 font-bold">{entry.total_points} pts</div>
                    <div className="text-xs text-gray-500">
                      {i === 0 ? '70% del asado' : i === 1 ? '30% del asado' : 'En la mira'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3 text-center">
              Aunque estés en Miami o el DF, giras el billete y se arma el asado 🥩
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
