import { type NextRequest } from 'next/server'
// Kita arahkan ke folder 'lib' sesuai struktur fotomu
import { updateSession } from './lib/supabase/middleware' 

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /* Melindungi semua rute kecuali file statis dan gambar */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}