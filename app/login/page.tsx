'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4">
      <Link href="/" className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors">
        <span className="text-2xl">⚽</span>
        <span className="font-bold text-lg">Polla Mundial 2026</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
          <p className="text-gray-400 mb-6">Inicia sesión para ver tus predicciones</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 mt-4">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-green-400 hover:text-green-300 font-medium">
            Inscríbete aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
