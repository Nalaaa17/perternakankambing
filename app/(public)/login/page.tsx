"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
// 1. TAMBAHKAN IMPORT BERIKUT
import { useSearchParams } from "next/navigation";
import { login, signup } from "@/app/auth/actions";
import { Mail, Lock, User, ShieldCheck, UserPlus, LogIn, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  // 2. LOGIKA UNTUK MENANGKAP PESAN ERROR/SUKSES DARI URL
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen bg-[#f8f7f3] flex items-center justify-center p-6 md:p-12 selection:bg-[#94afc9] overflow-hidden">
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white border-4 border-[#02253d] shadow-[16px_16px_0px_0px_rgba(2,37,61,1)] overflow-hidden">
        
        {/* SISI KIRI: Branding & Ilustrasi (TETAP) */}
        <div className="hidden lg:flex flex-col justify-between bg-[#02253d] text-[#f8f7f3] p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#f8f7f3 2px, transparent 2px)", backgroundSize: "24px 24px" }}></div>
          
          <div className="relative z-10">
            <ShieldCheck className="w-16 h-16 text-[#94afc9] mb-8" />
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-6">
              Pojok Cerdas <br />
              <span className="text-[#94afc9]">Agroindustri.</span>
            </h1>
            <p className="text-xl font-medium text-[#94afc9] max-w-md">
              Bergabunglah dengan komunitas kami. Dapatkan akses langsung ke produk peternakan premium dari tangan pertama.
            </p>
          </div>

          <div className="relative z-10">
            <div className="border-l-4 border-[#c2b2a3] pl-6 py-2">
              <p className="font-bold text-lg">"Kualitas segar langsung dari kandang, dijamin halal dan higienis."</p>
            </div>
          </div>
        </div>

        {/* SISI KANAN: Area Formulir Interaktif */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-white relative overflow-hidden">
          
          {/* 3. NOTIFIKASI PESAN (BARU) */}
          <div className="absolute top-4 left-8 right-8 z-30">
            {error && (
              <div className="p-3 bg-red-100 border-4 border-red-600 text-red-600 font-black uppercase text-[10px] flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-4 h-4" /> {decodeURIComponent(error)}
              </div>
            )}
            {message && (
              <div className="p-3 bg-green-100 border-4 border-green-600 text-green-600 font-black uppercase text-[10px] flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-4 h-4" /> {decodeURIComponent(message)}
              </div>
            )}
          </div>

          {/* TOMBOL TOGGLE (TETAP) */}
          <div className="absolute top-8 right-8 flex border-4 border-[#02253d] font-black uppercase text-sm cursor-pointer shadow-[4px_4px_0px_0px_rgba(2,37,61,1)] bg-[#f8f7f3] relative w-64 h-14 overflow-hidden z-20 mx-auto md:mx-0 md:absolute">
            <div 
              className={`absolute top-0 bottom-0 w-1/2 bg-[#02253d] transition-transform duration-500 ease-in-out ${
                isLogin ? "translate-x-0" : "translate-x-full"
              }`}
            ></div>
            
            <div 
              onClick={() => setIsLogin(true)}
              className={`flex-1 flex items-center justify-center relative z-10 transition-colors duration-500 ${isLogin ? "text-white" : "text-[#02253d] hover:text-[#2f496e]"}`}
            >
              Masuk
            </div>
            <div className="w-1 bg-[#02253d] relative z-20"></div>
            <div 
              onClick={() => setIsLogin(false)}
              className={`flex-1 flex items-center justify-center relative z-10 transition-colors duration-500 ${!isLogin ? "text-white" : "text-[#02253d] hover:text-[#2f496e]"}`}
            >
              Daftar
            </div>
          </div>

          {/* WRAPPER FORMULIR (SLIDING ANIMATION) */}
          <div className="mt-20 md:mt-12 overflow-hidden w-full relative">
            <div 
              className={`flex w-[200%] transition-transform duration-500 ease-in-out ${
                isLogin ? "translate-x-0" : "-translate-x-1/2"
              }`}
            >
              
              {/* --- FORM LOGIN (Bagian Kiri) --- */}
              <div className="w-1/2 px-1">
                <h2 className="text-5xl font-black text-[#02253d] uppercase tracking-tighter mb-2">Selamat Datang</h2>
                <p className="text-[#2f496e] font-bold mb-10">Silakan masuk untuk melanjutkan pesanan Anda.</p>
                
                {/* 4. HUBUNGKAN ACTION DAN TAMBAHKAN NAME PADA INPUT */}
                <form action={login} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#02253d] uppercase tracking-widest">Alamat Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#02253d]"><Mail className="w-6 h-6" /></div>
                      <input name="email" type="email" required className="w-full bg-[#f8f7f3] border-4 border-[#02253d] pl-14 pr-4 py-4 font-bold text-[#02253d] placeholder:text-[#94afc9] focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_rgba(2,37,61,1)] transition-all" placeholder="email@contoh.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#02253d] uppercase tracking-widest">Kata Sandi</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#02253d]"><Lock className="w-6 h-6" /></div>
                      <input name="password" type="password" required className="w-full bg-[#f8f7f3] border-4 border-[#02253d] pl-14 pr-4 py-4 font-bold text-[#02253d] placeholder:text-[#94afc9] focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_rgba(2,37,61,1)] transition-all" placeholder="••••••••" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link href="#" className="text-sm font-bold text-[#2f496e] hover:text-[#c2b2a3] transition-colors underline decoration-2 underline-offset-4">Lupa kata sandi?</Link>
                  </div>

                  <button type="submit" className="w-full bg-[#02253d] text-white py-5 text-xl font-black hover:bg-[#2f496e] transition-all shadow-[8px_8px_0px_0px_rgba(194,178,163,1)] active:translate-y-1 active:shadow-none uppercase flex items-center justify-center gap-4 mt-8 group">
                    <LogIn className="w-6 h-6 group-hover:scale-110 transition-transform" /> Masuk Sekarang
                  </button>
                </form>
              </div>

              {/* --- FORM REGISTER (Bagian Kanan) --- */}
              <div className="w-1/2 px-1">
                <h2 className="text-5xl font-black text-[#02253d] uppercase tracking-tighter mb-2">Buat Akun Baru</h2>
                <p className="text-[#2f496e] font-bold mb-10">Daftar sekarang dan nikmati produk segar kami.</p>

                {/* 5. HUBUNGKAN ACTION DAN TAMBAHKAN NAME PADA INPUT */}
                <form action={signup} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#02253d] uppercase tracking-widest">Nama Lengkap</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#02253d]"><User className="w-6 h-6" /></div>
                      <input name="fullName" type="text" required className="w-full bg-[#f8f7f3] border-4 border-[#02253d] pl-14 pr-4 py-4 font-bold text-[#02253d] placeholder:text-[#94afc9] focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_rgba(2,37,61,1)] transition-all" placeholder="Ahmad Fauzi" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#02253d] uppercase tracking-widest">Alamat Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#02253d]"><Mail className="w-6 h-6" /></div>
                      <input name="email" type="email" required className="w-full bg-[#f8f7f3] border-4 border-[#02253d] pl-14 pr-4 py-4 font-bold text-[#02253d] placeholder:text-[#94afc9] focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_rgba(2,37,61,1)] transition-all" placeholder="email@contoh.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#02253d] uppercase tracking-widest">Kata Sandi</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#02253d]"><Lock className="w-6 h-6" /></div>
                      <input name="password" type="password" required className="w-full bg-[#f8f7f3] border-4 border-[#02253d] pl-14 pr-4 py-4 font-bold text-[#02253d] placeholder:text-[#94afc9] focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_rgba(2,37,61,1)] transition-all" placeholder="••••••••" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-[#02253d] text-white py-5 text-xl font-black hover:bg-[#2f496e] transition-all shadow-[8px_8px_0px_0px_rgba(194,178,163,1)] active:translate-y-1 active:shadow-none uppercase flex items-center justify-center gap-4 mt-8 group">
                    <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform" /> Daftar Akun
                  </button>
                </form>
              </div>

            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}