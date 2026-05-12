import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Polla Mundial 2026 – Adictos',
  description: 'La polla oficial del grupo Adictos para el Mundial 2026 USA/México/Canadá',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  )
}
