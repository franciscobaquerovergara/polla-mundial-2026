'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'

const COINK_NUMBER = process.env.NEXT_PUBLIC_COINK_NUMBER || '+573001234567'
const COINK_NAME = process.env.NEXT_PUBLIC_COINK_NAME || 'Juan Pablo Restrepo'
const ENTRY_FEE = process.env.NEXT_PUBLIC_ENTRY_FEE || '300000'

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    payment_reference: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!form.payment_reference.trim()) {
      setError('Debes ingresar el número de transacción Coink para completar el registro')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          username: form.username,
          phone: form.phone,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message === 'User already registered'
        ? 'Este email ya está registrado'
        : signUpError.message)
      setLoading(false)
      return
    }

    // Actualizar perfil con datos adicionales
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        username: form.username,
        full_name: form.full_name,
        phone: form.phone,
        city: form.city,
        payment_reference: form.payment_reference,
        payment_status: 'pending',
      })
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4 py-10">
      <Link href="/" className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors">
        <span className="text-2xl">⚽</span>
        <span className="font-bold text-lg">Polla Mundial 2026</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Progreso */}
        <div className="flex items-center mb-8">
          <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-green-500' : 'bg-gray-700'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 text-sm font-bold
            ${step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}>1</div>
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-green-500' : 'bg-gray-700'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 text-sm font-bold
            ${step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}>2</div>
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-green-500' : 'bg-gray-700'}`} />
        </div>

        <div className="card p-8">
          {step === 1 ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Crea tu cuenta</h1>
              <p className="text-gray-400 mb-6">Paso 1 de 2 — Datos personales</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre completo *</label>
                  <input name="full_name" required value={form.full_name} onChange={handleChange}
                    className="input-field" placeholder="Juan Pablo Restrepo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username (apodo en el chat) *</label>
                  <input name="username" required value={form.username} onChange={handleChange}
                    className="input-field" placeholder="juanpablo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange}
                    className="input-field" placeholder="tu@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña *</label>
                  <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange}
                    className="input-field" placeholder="Mínimo 6 caracteres" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Celular</label>
                    <input name="phone" value={form.phone} onChange={handleChange}
                      className="input-field" placeholder="+573001234567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ciudad</label>
                    <input name="city" value={form.city} onChange={handleChange}
                      className="input-field" placeholder="Bogotá" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!form.full_name || !form.username || !form.email || !form.password) {
                      setError('Llena todos los campos obligatorios')
                      return
                    }
                    setError('')
                    setStep(2)
                  }}
                  className="btn-primary w-full py-3"
                >
                  Siguiente: Pagar Inscripción →
                </button>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              </div>
            </>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <h1 className="text-2xl font-bold text-white mb-2">Pago de Inscripción</h1>
              <p className="text-gray-400 mb-4">Paso 2 de 2 — Confirma tu pago</p>

              {/* Instrucciones de pago */}
              <div className="bg-green-900/20 border border-green-700/50 rounded-xl p-5">
                <div className="text-green-400 font-bold text-lg mb-3">💵 Envía tu pago por Coink</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monto:</span>
                    <span className="text-white font-bold">${parseInt(ENTRY_FEE).toLocaleString()} COP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nombre:</span>
                    <span className="text-white font-bold">{COINK_NAME}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Número Coink:</span>
                    <span className="text-white font-bold">{COINK_NUMBER}</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  ⚠️ En el concepto del pago pon tu nombre completo. El admin confirmará manualmente.
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Número de transacción Coink *
                </label>
                <input
                  name="payment_reference"
                  required
                  value={form.payment_reference}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Ej: 2026051100123456"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lo encuentras en el comprobante de pago de Coink
                </p>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-lg p-3">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                  ← Volver
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
                  {loading ? 'Registrando...' : '✅ Completar Registro'}
                </button>
              </div>

              <p className="text-xs text-gray-600 text-center">
                Tu cuenta quedará <span className="text-yellow-400">pendiente</span> hasta que el admin confirme el pago
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-gray-500 mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-green-400 hover:text-green-300 font-medium">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
