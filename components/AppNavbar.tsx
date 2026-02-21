"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/app/auth/actions";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  // --- STATE ---
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // 1. FUNGSI PENYEDOT DATA KERANJANG YANG LEBIH STABIL
  const fetchCartCount = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      // Kita pakai select('id') yang lebih sederhana dan anti-gagal dibanding fitur count
      const { data, error } = await supabase
        .from('cart_items')
        .select('id')
        .eq('user_id', currentUser.id);

      if (!error && data) {
        setCartCount(data.length);
      }
    } else {
      setCartCount(0);
    }
  };

  // 2. EFEK 1: PANTAU PERPINDAHAN HALAMAN (KUNCI PERBAIKAN)
  // Setiap kali URL berubah (misal dari /katalog ke /keranjang), jalankan fetchCartCount
  useEffect(() => {
    fetchCartCount();

    // --- ALAT TELEPATI: PENERIMA SINYAL ---
    // Jika ada sinyal 'cartChanged' dari halaman manapun, langsung update angka!
    const syncCart = () => {
      fetchCartCount();
    };
    window.addEventListener('cartChanged', syncCart);

    // Bersihkan sinyal saat komponen ditutup
    return () => {
      window.removeEventListener('cartChanged', syncCart);
    };
  }, [pathname]); // <-- Pastikan [pathname]

  // 3. EFEK 2: PANTAU LOGIN/LOGOUT
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        fetchCartCount();
        router.refresh();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <nav className="sticky top-0 z-50 bg-[#f8f7f3] border-b-4 border-[#02253d] px-4 md:px-12 py-4 md:py-6 shadow-[0_4px_0_0_rgba(2,37,61,0.1)] relative">
      <div className="flex items-center justify-between">
        
        {/* LOGO BRANDING */}
        <Link href="/" className="flex items-center gap-3 md:gap-5 group">
          <div className="relative w-12 h-12 md:w-20 md:h-20 bg-[#02253d] rotate-3 group-hover:rotate-0 transition-transform shadow-[4px_4px_0_0_rgba(194,178,163,1)]">
            <Image 
              src="/Foto/LogoPPKO26.jpeg" 
              alt="Logo Pojok Cerdas"
              fill
              sizes="(max-width: 768px) 48px, 80px" 
              className="object-cover p-1 bg-white" 
            />
          </div>
          <div className="flex flex-col leading-none justify-center">
            <span className="text-xl md:text-3xl font-black tracking-tighter uppercase text-[#02253d]">Pojok Cerdas</span>
            <span className="text-[10px] md:text-sm font-bold tracking-[0.3em] uppercase text-[#94afc9] mt-1">Agroindustri</span>
          </div>
        </Link>

        {/* MENU NAVIGASI TENGAH */}
        <div className="hidden lg:flex items-center gap-12">
           <Link href="/" className={`font-black text-lg uppercase tracking-widest transition-colors ${pathname === "/" ? "text-[#02253d] border-b-4 border-[#02253d] pb-2" : "text-[#94afc9] hover:text-[#02253d]"}`}>Beranda</Link>
           <Link href="/katalog" className={`font-black text-lg uppercase tracking-widest transition-colors ${pathname.includes("/katalog") ? "text-[#02253d] border-b-4 border-[#02253d] pb-2" : "text-[#94afc9] hover:text-[#02253d]"}`}>Katalog</Link>
           <Link href="/tentang" className={`font-black text-lg uppercase tracking-widest transition-colors ${pathname === "/tentang" ? "text-[#02253d] border-b-4 border-[#02253d] pb-2" : "text-[#94afc9] hover:text-[#02253d]"}`}>Tentang Peternak</Link>
        </div>

        {/* AUTH & KERANJANG (DESKTOP) */}
        <div className="hidden md:flex items-center gap-8">
          {!user ? (
             <Link href="/login" className="bg-[#02253d] text-[#f8f7f3] px-10 py-4 font-black text-lg uppercase hover:bg-[#2f496e] transition-all shadow-[8px_8px_0_0_rgba(194,178,163,1)]">Masuk</Link>
          ) : (
             <div className="flex items-center gap-8">
                
                {/* IKON KERANJANG DESKTOP DINAMIS */}
                <Link href="/keranjang" className="relative group p-3">
                   <ShoppingCart className="w-8 h-8 text-[#02253d] group-hover:scale-110 transition-transform" />
                   {cartCount > 0 && ( // Bulatan merah hanya muncul kalau ada barang
                     <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center border-2 border-[#02253d]">
                       {cartCount}
                     </span>
                   )}
                </Link>

                {/* DROPDOWN AKUN SAYA */}
                <div className="relative group">
                   <button className="flex items-center gap-3 bg-[#f8f7f3] border-4 border-[#02253d] px-6 py-3 font-black uppercase text-lg text-[#02253d] shadow-[6px_6px_0_0_rgba(2,37,61,1)] group-hover:bg-[#02253d] group-hover:text-white transition-all">
                      <User className="w-6 h-6" /> Akun Saya
                   </button>
                   <div className="absolute right-0 mt-6 w-72 bg-white border-4 border-[#02253d] shadow-[12px_12px_0_0_rgba(2,37,61,1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col z-50">
                      <div className="bg-[#02253d] text-white p-5 border-b-4 border-[#02253d]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#94afc9]">Masuk sebagai</p>
                        <p className="font-black text-sm truncate mt-1">{user.email}</p>
                      </div>
                      <Link href="/profil" className="px-6 py-5 font-black text-base text-[#02253d] hover:bg-[#c2b2a3] border-b-2 border-[#02253d] flex items-center gap-4 uppercase transition-colors">
                         <User className="w-6 h-6" /> Profil
                      </Link>
                      <button onClick={() => signout()} className="px-6 py-5 font-black text-base text-red-600 hover:bg-red-50 w-full text-left flex items-center gap-4 uppercase transition-colors">
                         <LogOut className="w-6 h-6" /> Keluar
                      </button>
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* TOMBOL MENU & KERANJANG (MOBILE) */}
        <div className="flex lg:hidden items-center gap-4">
          {user && (
            <Link href="/keranjang" className="relative p-2">
              <ShoppingCart className="w-7 h-7 text-[#02253d]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center border-2 border-[#02253d]">{cartCount}</span>
              )}
            </Link>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 border-4 border-[#02253d] bg-white text-[#02253d] shadow-[4px_4px_0_0_rgba(2,37,61,1)]">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* DROPDOWN MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#f8f7f3] border-b-4 border-[#02253d] flex flex-col lg:hidden z-50">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-5 border-b-2 border-[#c2b2a3] font-black text-[#02253d] uppercase">Beranda</Link>
          <Link href="/katalog" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-5 border-b-2 border-[#c2b2a3] font-black text-[#02253d] uppercase">Katalog</Link>
          <Link href="/tentang" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-5 border-b-2 border-[#c2b2a3] font-black text-[#02253d] uppercase">Tentang</Link>
          {!user ? (
            <div className="p-6">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full bg-[#02253d] text-white text-center py-4 font-black uppercase shadow-[6px_6px_0_0_rgba(194,178,163,1)]">Masuk</Link>
            </div>
          ) : (
            <div className="bg-white">
              <div className="bg-[#02253d] text-white p-6">
                <p className="font-bold text-sm truncate">{user.email}</p>
              </div>
              <Link href="/profil" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-5 border-b-2 border-[#c2b2a3] font-black text-[#02253d] uppercase flex items-center gap-4"><User className="w-5 h-5" /> Profil Akun</Link>
              <button onClick={() => { signout(); setIsMobileMenuOpen(false); }} className="w-full px-6 py-5 font-black text-red-600 uppercase flex items-center gap-4 text-left"><LogOut className="w-5 h-5" /> Keluar</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}