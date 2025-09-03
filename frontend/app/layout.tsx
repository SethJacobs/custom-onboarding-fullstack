import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Custom Onboarding Flow',
  description: 'Wizard onboarding with admin-configurable steps',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="max-w-5xl mx-auto py-8 px-4">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold">Zealthy — Onboarding Demo</h1>
            <nav className="flex gap-3 text-sm">
              <a href="/" className="text-white/80 hover:text-white">Onboarding</a>
              <a href="/admin" className="text-white/80 hover:text-white">Admin</a>
              <a href="/data" className="text-white/80 hover:text-white">Data</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
