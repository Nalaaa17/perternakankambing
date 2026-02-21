"use client";

import * as React from "react";
import { useState } from "react"; // Tambahan state untuk HP
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Menu, // Ikon menu untuk HP
  X     // Ikon tutup menu untuk HP
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // State untuk mengontrol buka/tutup menu di HP
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-6 h-6" />, path: "/dashboard" },
    { name: "Kelola Produk", icon: <Package className="w-6 h-6" />, path: "/dashboard/produk" },
    { name: "Pesanan Masuk", icon: <ShoppingCart className="w-6 h-6" />, path: "/dashboard/pesanan" },
    { name: "Pelanggan", icon: <Users className="w-6 h-6" />, path: "/dashboard/pelanggan" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f7f3] font-sans selection:bg-[#94afc9]">
      
      {/* ========================================= */}
      {/* 1. HEADER MOBILE (Hanya Muncul di Layar HP) */}
      {/* ========================================= */}
      <div className="md:hidden bg-[#02253d] text-white p-4 border-b-4 border-[#2f496e] flex items-center justify-between sticky top-0 z-50 shadow-[0_4px_0_0_rgba(2,37,61,0.2)]">
        
        {/* Logo & Judul Mini */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-[#f8f7f3] p-0.5 shadow-[2px_2px_0px_0px_rgba(194,178,163,1)] shrink-0">
            <Image 
              src="/Foto/LogoPPKO26.jpeg" 
              alt="Logo Admin"
              fill
              className="object-cover p-0.5"
            />
          </div>
          <h2 className="text-lg font-black uppercase tracking-tighter leading-none text-[#f8f7f3]">
            Admin Panel
          </h2>
        </div>

        {/* Tombol Hamburger / Tutup */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-[#f8f7f3] text-[#02253d] border-2 border-[#02253d] shadow-[2px_2px_0px_0px_rgba(194,178,163,1)] active:translate-y-1 active:shadow-none transition-all"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ========================================= */}
      {/* 2. OVERLAY GELAP (Layar belakang saat menu HP terbuka) */}
      {/* ========================================= */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#02253d]/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ========================================= */}
      {/* 3. SIDEBAR ADMIN (Utama) */}
      {/* ========================================= */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 md:w-80 bg-[#02253d] text-white border-r-8 border-[#02253d] flex flex-col h-screen overflow-y-auto transition-transform duration-300 ease-in-out md:sticky md:top-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        
        {/* Logo Admin Besar (Hanya Muncul di Layar Laptop) */}
        <div className="hidden md:flex p-8 border-b-4 border-[#2f496e] items-center gap-4 bg-[#02253d]">
          <div className="relative w-16 h-16 bg-[#f8f7f3] p-1 shadow-[4px_4px_0px_0px_rgba(194,178,163,1)] overflow-hidden shrink-0">
            <Image 
              src="/Foto/LogoPPKO26.jpeg" 
              alt="Logo" 
              fill 
              sizes="200px" // <--- Tambahkan ini (sesuaikan dengan lebar logomu)
              priority      // Tambahkan ini juga karena logo adalah elemen penting (LCP)
              className="object-contain" 
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black uppercase tracking-tighter leading-none text-[#f8f7f3]">
              Admin <br /> Panel
            </h2>
            <p className="text-[9px] font-bold tracking-[0.2em] text-[#94afc9] uppercase mt-1">
              Pojok Cerdas
            </p>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 p-6 space-y-4 mt-4 md:mt-0">
          <p className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest mb-4 ml-2">Menu Utama</p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)} // Otomatis tutup menu saat diklik (HP)
                className={`flex items-center gap-4 px-6 py-4 font-black uppercase text-sm transition-all border-4 ${
                  isActive 
                    ? "bg-[#f8f7f3] text-[#02253d] border-[#f8f7f3] shadow-[6px_6px_0px_0px_rgba(194,178,163,1)]" 
                    : "bg-transparent text-white border-transparent hover:border-[#f8f7f3] hover:bg-[#2f496e]"
                }`}
              >
                {item.icon} {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Tombol Keluar */}
        <div className="p-6 border-t-4 border-[#2f496e]">
          <Link 
            href="/login"
            className="flex items-center gap-4 px-6 py-4 font-black uppercase text-sm bg-red-600 text-white border-4 border-red-600 hover:bg-white hover:text-red-600 hover:border-red-600 transition-all shadow-[6px_6px_0px_0px_rgba(194,178,163,0.2)]"
          >
            <LogOut className="w-6 h-6" /> Keluar Sistem
          </Link>
        </div>
      </aside>

      {/* ========================================= */}
      {/* 4. KONTEN UTAMA (Kanan / Bawah) */}
      {/* ========================================= */}
      {/* Padding dibuat lebih kecil (p-4) di HP agar layar tidak termakan ruang kosong */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden w-full">
        {children}
      </main>

    </div>
  );
}