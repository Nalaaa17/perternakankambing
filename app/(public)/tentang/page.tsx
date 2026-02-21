"use client";

import Image from "next/image";
import { MapPin, Calendar, Award, Users, Mail, Phone } from "lucide-react";

export default function TentangPage() {
  return (
    <div className="bg-[#f8f7f3] min-h-screen pb-24 selection:bg-[#94afc9]">
      
      {/* 1. HERO SECTION: JUDUL BESAR */}
      <header className="px-6 md:px-12 py-20 border-b-4 border-[#02253d] bg-white">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase text-[#02253d] leading-[0.8]">
          Cerita <br /> <span className="text-[#2f496e]">Di Balik Kandang.</span>
        </h1>
      </header>

      {/* 2. SEJARAH & VISI (Layout 2 Kolom) */}
      <section className="px-6 md:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative h-[400px] md:h-[600px] border-4 border-[#02253d] shadow-[16px_16px_0px_0px_rgba(47,73,110,1)]">
          <Image 
            src="/Foto/bg.jpeg" 
            alt="Suasana Peternakan" 
            fill 
            className="object-cover"
          />
        </div>
        <div className="space-y-8">
          <div className="inline-block bg-[#c2b2a3] text-[#02253d] px-6 py-2 font-black uppercase border-2 border-[#02253d] skew-x-[-10deg]">
            Sejak 2018
          </div>
          <h2 className="text-5xl font-black text-[#02253d] uppercase tracking-tighter leading-none">
            Membangun Tradisi, <br />Menjaga Kualitas.
          </h2>
          <p className="text-xl text-[#2f496e] font-medium leading-relaxed">
            Berawal dari beberapa ekor kambing etawa di lahan kecil, Pojok Cerdas Agroindustri tumbuh dengan visi mendigitalisasi peternakan desa. Kami percaya bahwa produk lokal berkualitas premium layak mendapatkan tempat di meja makan setiap keluarga Indonesia.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 border-2 border-[#02253d] bg-white">
              <h4 className="font-black text-3xl text-[#02253d]">500+</h4>
              <p className="font-bold text-[#94afc9] uppercase text-xs">Kambing Sehat</p>
            </div>
            <div className="p-6 border-2 border-[#02253d] bg-white">
              <h4 className="font-black text-3xl text-[#02253d]">12+</h4>
              <p className="font-bold text-[#94afc9] uppercase text-xs">Peternak Binaan</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROFIL PEMILIK (Bento Grid Style) */}
      <section className="px-6 md:px-12 py-24 bg-[#02253d] text-[#f8f7f3] overflow-hidden">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/3 space-y-6">
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">
              Sosok Di <br /> Balik Layar.
            </h2>
            <p className="text-[#94afc9] text-lg font-medium">
              "Peternakan bukan hanya soal memberi makan hewan, tapi soal merawat kepercayaan konsumen melalui kejujuran produk."
            </p>
          </div>
          
          {/* Card Pemilik */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="bg-[#f8f7f3] text-[#02253d] p-10 border-4 border-[#c2b2a3] relative">
              <div className="absolute top-0 right-0 bg-[#c2b2a3] p-4 border-l-4 border-b-4 border-[#02253d]">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black uppercase mb-2">H. Ahmad Fauzi</h3>
              <p className="font-bold text-[#2f496e] mb-6">Founder & Head of Production</p>
              <p className="font-medium opacity-80 mb-8">
                Berpengalaman lebih dari 15 tahun dalam manajemen ternak ruminansia dan pengolahan pakan silase.
              </p>
              <div className="flex gap-4">
                 <button className="bg-[#02253d] text-white p-3 hover:bg-[#2f496e] transition-colors"><Mail /></button>
                 <button className="bg-[#02253d] text-white p-3 hover:bg-[#2f496e] transition-colors"><Phone /></button>
              </div>
            </div>

            <div className="relative border-4 border-[#f8f7f3] h-[450px] overflow-hidden group"> 
              {/* Saya naikkan tingginya ke 450px agar lebih proporsional untuk portrait */}
              <Image 
                src="/Foto/bpk.jpeg" 
                alt="Owner" 
                fill 
                // Tambahkan 'object-top' agar kepala tidak terpotong
                className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. LOKASI & GOOGLE MAPS - VERSI FIX */}
      <section className="px-6 md:px-12 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Detail Lokasi (Teks) */}
          <div className="space-y-8">
            <h2 className="text-5xl font-black text-[#02253d] uppercase tracking-tighter leading-none">
              Kunjungi <br /> Kandang Kami.
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 border-2 border-[#02253d] bg-white shadow-[8px_8px_0px_0px_rgba(2,37,61,1)]">
                <MapPin className="w-8 h-8 text-[#2f496e] shrink-0" />
                <div>
                  <h4 className="font-black uppercase text-[#02253d]">Alamat Peternakan</h4>
                  <p className="font-medium text-[#2f496e]">Jl. Raya Desa Makmur No. 45, Kec. Agribisnis, Jawa Timur</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 border-2 border-[#02253d] bg-white shadow-[8px_8px_0px_0px_rgba(2,37,61,1)]">
                <Calendar className="w-8 h-8 text-[#2f496e] shrink-0" />
                <div>
                  <h4 className="font-black uppercase text-[#02253d]">Jam Operasional</h4>
                  <p className="font-medium text-[#2f496e]">Senin - Sabtu: 08.00 - 17.00 WIB</p>
                  <p className="text-xs font-bold text-red-500 uppercase mt-1">Minggu Tutup (Kecuali Janji Temu)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Embed dengan URL barumu */}
          <div className="lg:col-span-2 border-4 border-[#02253d] bg-[#c2b2a3] h-[500px] relative shadow-[16px_16px_0px_0px_rgba(148,175,201,1)] overflow-hidden flex flex-col items-center justify-center text-center p-8">
            
            {/* Latar Belakang Pola Titik */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#02253d 3px, transparent 3px)", backgroundSize: "30px 30px" }}></div>
            
            <MapPin className="w-28 h-28 text-[#02253d] mb-6 relative z-10 animate-bounce" />
            <h3 className="text-4xl md:text-5xl font-black text-[#02253d] uppercase mb-8 relative z-10 tracking-tighter">
              Cek Lokasi Kandang
            </h3>
            
            {/* Tombol dengan Link Direct Search ke Alun-Alun Jember */}
            <a 
              href="https://www.google.com/maps/search/Alun-Alun+Jember" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative z-10 bg-[#02253d] text-[#f8f7f3] px-10 py-6 text-xl md:text-2xl font-black border-4 border-[#02253d] hover:bg-[#f8f7f3] hover:text-[#02253d] transition-all shadow-[8px_8px_0px_0px_rgba(248,247,243,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 uppercase flex items-center gap-4"
            >
              Buka Google Maps 
            </a>
            
          </div>
        </div>
      </section>

    </div>
  );
}