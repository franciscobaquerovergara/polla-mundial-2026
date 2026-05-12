import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/dashboard')

  // Estadísticas generales
  const [
    { count: totalUsers },
    { count: pendingPayments },
    { count: confirmedPlayers },
    { count: playedMatches },
    { count: totalMatches },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('payment_status', 'pending'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('payment_status', 'confirmed'),
    supabase.from('matches').select('*', { count: 'exact', head: true }).eq('is_played', true),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
  ])

  const pozo = (confirmedPlayers ?? 0) * 300000

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar profile={profile} />

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">⚙️</span>
          <div>
            <h1 className="text-2xl font-black text-white">Panel de Administrador</h1>
            <p className="text-gray-400 text-sm">Hola {profile.username} — Solo tú ves esto</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 text-center">
            <div className="text-3xl font-black text-blue-400">{totalUsers ?? 0}</div>
            <div className="text-gray-400 text-sm">Registrados</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-black text-green-400">{confirmedPlayers ?? 0}</div>
            <div className="text-gray-400 text-sm">Confirmados</div>
          </div>
          <div className="card p-4 text-center border-yellow-800/30">
            <div className="text-3xl font-black text-yellow-400">{pendingPayments ?? 0}</div>
            <div className="text-gray-400 text-sm">⏳ Pendientes</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-black text-purple-400">{playedMatches ?? 0}/{totalMatches ?? 104}</div>
            <div className="text-gray-400 text-sm">Partidos jugados</div>
          </div>
        </div>

        {/* Pozo */}
        <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-5 mb-8">
          <div className="text-green-400 text-sm font-medium mb-1">💰 Pozo confirmado hasta ahora</div>
          <div className="text-4xl font-black text-white">${pozo.toLocaleString()} COP</div>
          <div className="text-gray-400 text-sm mt-1">
            {confirmedPlayers} participantes × $300.000 = ${pozo.toLocaleString()}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 text-center text-sm">
            <div><div className="text-yellow-400 font-bold">${Math.floor(pozo * 0.65).toLocaleString()}</div><div className="text-gray-500">Gordo (65%)</div></div>
            <div><div className="text-gray-300 font-bold">${Math.floor(pozo * 0.20).toLocaleString()}</div><div className="text-gray-500">1er Seco (20%)</div></div>
            <div><div className="text-amber-600 font-bold">${Math.floor(pozo * 0.15).toLocaleString()}</div><div className="text-gray-500">2do Seco (15%)</div></div>
          </div>
        </div>

        {/* Acciones admin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/payments" className="card p-6 hover:border-yellow-600 transition-all group">
            <div className="text-4xl mb-3">💳</div>
            <h3 className="text-white font-bold text-lg group-hover:text-yellow-400 transition-colors">
              Gestionar Pagos
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Confirmar o rechazar inscripciones de Coink
            </p>
            {(pendingPayments ?? 0) > 0 && (
              <div className="mt-3">
                <span className="badge-pending">{pendingPayments} pendientes</span>
              </div>
            )}
          </Link>

          <Link href="/admin/results" className="card p-6 hover:border-green-600 transition-all group">
            <div className="text-4xl mb-3">⚽</div>
            <h3 className="text-white font-bold text-lg group-hover:text-green-400 transition-colors">
              Ingresar Resultados
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Registrar marcadores de partidos jugados
            </p>
            <p className="text-xs text-gray-600 mt-2">Los puntos se calculan automáticamente</p>
          </Link>

          <Link href="/admin/bonuses" className="card p-6 hover:border-purple-600 transition-all group">
            <div className="text-4xl mb-3">🌟</div>
            <h3 className="text-white font-bold text-lg group-hover:text-purple-400 transition-colors">
              Resolver Bonos
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Ingresar resultados de Bota de Oro, Guante de Oro, etc.
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}
