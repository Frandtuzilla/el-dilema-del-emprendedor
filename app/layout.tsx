import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'El Dilema del Emprendedor - ITBA Future Day'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
