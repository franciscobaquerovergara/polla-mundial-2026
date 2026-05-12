import Link from 'next/link'

const GROUPS = [
  { name: 'A', teams: ['🇲🇽 México', '🇰🇷 Corea del Sur', '🇿🇦 Sudáfrica', '🇨🇿 Chequia'] },
  { name: 'B', teams: ['🇨🇦 Canadá', '🇧🇦 Bosnia y Herz.', '🇶🇦 Qatar', '🇨🇭 Suiza'] },
  { name: 'C', teams: ['🇧🇷 Brasil', '🇲🇦 Marruecos', '🇭🇹 Haití', '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escocia'] },
  { name: 'D', teams: ['🇺🇸 EE.UU.', '🇵🇾 Paraguay', '🇦🇺 Australia', '🇹🇷 Turquía'] },
  { name: 'E', teams: ['🇩🇪 Alemania', '🇨🇼 Curazao', '🇨🇮 Costa Marfil', '🇪🇨 Ecuador'] },
  { name: 'F', teams: ['🇳🇱 Países Bajos', '🇯🇵 Japón', '🇸🇪 Suecia', '🇹🇳 Túnez'] },
  { name: 'G', teams: ['🇧🇪 Bélgica', '🇪🇬 Egipto', '🇮🇷 Irán', '🇳🇿 Nueva Zelanda'] },
  { name: 'H', teams: ['🇪🇸 España', '🇨🇻 Cabo Verde', '🇸🇦 Arabia Saudita', '🇺🇾 Uruguay'] },
  { name: 'I', teams: ['🇫🇷 Francia', '🇸🇳 Senegal', '🇮🇶 Irak', '🇳🇴 Noruega'] },
  { name: 'J', teams: ['🇦🇷 Argentina', '🇩🇿 Argelia', '🇦🇹 Austria', '🇯🇴 Jordania'] },
  { name: 'K', teams: ['🇵🇹 Portugal', '🇨🇩 Rep. Dem. Congo', '🇺🇿 Uzbekistán', '🇨🇴 Colombia'] },
  { name: 'L', teams: ['🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra', '🇭🇷 Croacia', '🇬🇭 Ghana', '🇵🇦 Panamá'] },
]

export default function LandingPage() {
  const daysUntilWC = Math.ceil((new Date('2026-06-11').getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚽</span>
            <div>
              <h1 className="text-xl font-bold text-white">Polla Mundial 2026</h1>
              <p className="text-xs text-gray-400">Grupo Adictos</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="btn-secondary text-sm">Iniciar Sesión</Link>
            <Link href="/register" className="btn-primary text-sm">Inscribirme</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="inline-block bg-green-900/30 border border-green-700 rounded-full px-4 py-1 text-green-400 text-sm font-medium mb-6">
          🏆 FIFA World Cup 2026 — USA · México · Canadá
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
          La Polla Más<br />
          <span className="text-green-400">Adicta</span> del Mundo
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          48 equipos. 104 partidos. 6 semanas de pasión. Predice, compite y gánate el asado… o págalo.
        </p>

        {daysUntilWC > 0 && (
          <div className="inline-flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-2xl px-8 py-4 mb-10">
            <div className="text-center">
              <div className="text-4xl font-black text-green-400">{daysUntilWC}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">días</div>
            </div>
            <div className="text-gray-600 text-2xl">|</div>
            <div className="text-gray-300">para el pitazo inicial<br /><span className="text-sm text-gray-500">11 de junio, 2026</span></div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-primary text-lg px-8 py-3 rounded-xl">
            🎯 Unirme a la Polla
          </Link>
          <Link href="/leaderboard" className="btn-secondary text-lg px-8 py-3 rounded-xl">
            📊 Ver Tabla
          </Link>
        </div>
      </section>

      {/* Premios */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-2xl font-bold text-center text-white mb-8">💰 Distribución de Premios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="card p-6 text-center">
            <div className="text-5xl mb-3">🥇</div>
            <div className="text-yellow-400 font-black text-3xl">65%</div>
            <div className="text-white font-bold mt-1">El Gordo</div>
            <div className="text-gray-400 text-sm">Campeón de la Polla</div>
            <div className="text-green-400 font-semibold mt-2">~$9.4M COP</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-5xl mb-3">🏅</div>
            <div className="text-gray-300 font-black text-3xl">20%</div>
            <div className="text-white font-bold mt-1">Primer Seco</div>
            <div className="text-gray-400 text-sm">Líder tras Fase de Grupos</div>
            <div className="text-green-400 font-semibold mt-2">~$2.9M COP</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-5xl mb-3">🥈</div>
            <div className="text-amber-600 font-black text-3xl">15%</div>
            <div className="text-white font-bold mt-1">Segundo Seco</div>
            <div className="text-gray-400 text-sm">2do lugar en el marcador final</div>
            <div className="text-green-400 font-semibold mt-2">~$2.2M COP</div>
          </div>
        </div>
        <div className="card p-4 text-center border-red-800/50">
          <span className="text-red-400 font-bold">💀 Vergonha:</span>
          <span className="text-gray-300 ml-2">Los últimos 3 pagan asado (70% / 30% los dos últimos)</span>
          <span className="text-gray-500 text-sm ml-2">— aunque estés en Miami, giras el billete</span>
        </div>
      </section>

      {/* Sistema de puntos */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-2xl font-bold text-center text-white mb-8">⚡ Sistema de Puntos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <span>🎯</span> Predicciones por Partido
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Solo ganador/empate correcto</span>
                <span className="text-green-400 font-bold">2 pts</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-800 pt-3">
                <span className="text-gray-300">Marcador exacto</span>
                <span className="text-yellow-400 font-bold text-xl">8 pts</span>
              </div>
              <div className="text-xs text-gray-500 bg-gray-800 rounded-lg p-3">
                Exacto = 4 bonus + 2 ganador + 1 goles local + 1 goles visita
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <span>🚀</span> Multiplicadores por Ronda
            </h4>
            <div className="space-y-2 text-sm">
              {[
                ['Fase de Grupos', '×1'],
                ['Ronda de 32', '×1.5'],
                ['Octavos de Final', '×2'],
                ['Cuartos de Final', '×2.5'],
                ['Semifinal', '×3'],
                ['Gran Final', '×4'],
              ].map(([stage, mult]) => (
                <div key={stage} className="flex justify-between items-center">
                  <span className="text-gray-400">{stage}</span>
                  <span className="text-green-400 font-bold">{mult}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">
              💡 Catch-up logic — quien va atrás aún puede remontar
            </p>
          </div>

          <div className="card p-6 md:col-span-2">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <span>🌟</span> Bonos del Torneo (predicciones antes del primer partido)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                ['👟', 'Bota de Oro', '20 pts'],
                ['🧤', 'Guante de Oro', '15 pts'],
                ['🎯', 'Rey de Asistencias', '15 pts'],
                ['🏆', 'Campeón del Mundial', '20 pts'],
                ['🐻', 'La Cueva del Oso (peor equipo)', '20 pts'],
                ['💀', 'El Peor Adicto', '30 pts 🔥'],
              ].map(([emoji, label, pts]) => (
                <div key={label} className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="text-white text-xs font-medium">{label}</div>
                  <div className="text-green-400 text-sm font-bold mt-1">{pts}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grupos */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-2xl font-bold text-center text-white mb-8">🌍 Los 12 Grupos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {GROUPS.map(g => (
            <div key={g.name} className="card p-4">
              <div className="text-green-400 font-black text-lg mb-2">Grupo {g.name}</div>
              <div className="space-y-1">
                {g.teams.map(t => (
                  <div key={t} className="text-gray-300 text-sm">{t}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="card p-10 border-green-800/50">
          <div className="text-5xl mb-4">⚽</div>
          <h3 className="text-3xl font-black text-white mb-2">¿Listo para entrar?</h3>
          <p className="text-gray-400 mb-6">Inscripción: <span className="text-green-400 font-bold">$300.000 COP</span> vía Coink</p>
          <Link href="/register" className="btn-primary text-lg px-10 py-4 rounded-xl inline-block">
            🎯 Inscribirme Ahora
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-6 text-center text-gray-600 text-sm">
        Polla Municipal Adicta 2026 — Hecha con amor y miedo al asado 🔥
      </footer>
    </div>
  )
}
