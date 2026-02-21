"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
// Import Ikon untuk section baru
import { Sprout, HeartHandshake, ShieldCheck, ArrowUpRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// --- DATA ---
const products = [
  // ... (Data produk biarkan sama seperti sebelumnya) ...
  {
    title: "Susu Kambing Etawa",
    description: "Segar, murni, dan kaya manfaat. Diproses dengan standar kebersihan tinggi langsung dari peternakan.",
    image: "/Foto/susu.jpeg",
    bgColor: "bg-[#2f496e]",
    textColor: "text-[#f8f7f3]",
    accentColor: "text-[#94afc9]",
  },
  {
    title: "Daging Segar Premium",
    description: "Pilihan tepat untuk aqiqah atau konsumsi harian. Daging empuk dan terjamin kualitasnya.",
    image: "/Foto/dg.jpg",
    bgColor: "bg-[#c2b2a3]",
    textColor: "text-[#02253d]",
    accentColor: "text-[#02253d]",
  },
  {
    title: "Pupuk Kandang Organik",
    description: "Penyubur tanaman alami berkualitas tinggi dari hasil pengolahan limbah peternakan yang ramah lingkungan.",
    image: "/Foto/Pupuk.jpeg",
    bgColor: "bg-[#94afc9]",
    textColor: "text-[#02253d]",
    accentColor: "text-[#02253d]",
  },
];

// Data untuk Section "Kenapa Memilih Kami"
const reasons = [
  {
    icon: <Sprout className="w-12 h-12" />,
    title: "Murni dari Alam",
    description: "Produk kami berasal dari kambing yang diberi pakan alami berkualitas, tanpa bahan kimia berbahaya. Kesegaran terjamin langsung dari kandang ke tangan Anda.",
    bgColor: "bg-[#c2b2a3]", // Warna saat hover
  },
  {
    icon: <HeartHandshake className="w-12 h-12" />,
    title: "Pemberdayaan Desa",
    description: "Setiap pembelian Anda secara langsung membantu meningkatkan ekonomi peternak kecil di desa dan membuka lapangan kerja baru bagi masyarakat sekitar.",
    bgColor: "bg-[#2f496e]", // Warna saat hover
  },
  {
    icon: <ShieldCheck className="w-12 h-12" />,
    title: "Kualitas Terjamin",
    description: "Proses pemerahan, pemotongan, hingga pengemasan dilakukan dengan standar kebersihan yang ketat dan diawasi oleh tenaga ahli.",
    bgColor: "bg-[#94afc9]", // Warna saat hover
  },
];


// --- KOMPONEN UTAMA ---
export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <>
      {/* 1. HERO SECTION (Kode sama seperti sebelumnya) */}
      <header className="relative px-6 py-32 md:py-48 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Foto/bg.jpeg"
            alt="Latar Belakang Peternakan"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#f8f7f3]/85 backdrop-blur-sm z-10"></div>
        </div>

        <div className="relative z-20 flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight text-[#02253d]">
            Pemberdayaan <br />
            <span className="text-[#2f496e]">Peternakan Desa.</span>
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl mb-10 text-[#2f496e] font-medium">
            Membantu pemasaran produk unggulan peternak kambing langsung ke tangan Anda, dengan kualitas terbaik dan terpercaya.
          </p>
          <button className="bg-[#02253d] text-[#f8f7f3] px-10 py-5 rounded-none font-bold text-xl hover:bg-[#2f496e] transition-colors border-2 border-[#02253d]">
            Jelajahi Produk
          </button>
        </div>
      </header>

      {/* 2. CAROUSEL PRODUK (Kode sama seperti sebelumnya) */}
      <section className="px-6 md:px-12 py-24 bg-[#f8f7f3] border-b-2 border-[#02253d]">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {products.map((product, index) => (
              <CarouselItem key={index}>
                <div className={`grid grid-cols-1 md:grid-cols-2 min-h-[500px] ${product.bgColor} ${product.textColor} border-2 border-[#02253d]`}>
                  <div className="p-12 md:p-20 flex flex-col justify-center">
                    <p className={`${product.accentColor} font-bold mb-4 tracking-widest uppercase`}>
                      Produk Utama
                    </p>
                    <h3 className="text-5xl md:text-6xl font-black mb-6 leading-none">
                      {product.title}
                    </h3>
                    <p className="text-lg opacity-90 max-w-md font-medium">
                      {product.description}
                    </p>
                  </div>
                  <div className="relative h-[300px] md:h-full w-full border-t-2 md:border-t-0 md:border-l-2 border-[#02253d]">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-4 border-2 border-[#02253d] bg-[#f8f7f3] hover:bg-[#c2b2a3] text-[#02253d] w-14 h-14 rounded-none" />
            <CarouselNext className="right-4 border-2 border-[#02253d] bg-[#f8f7f3] hover:bg-[#c2b2a3] text-[#02253d] w-14 h-14 rounded-none" />
          </div>
        </Carousel>
      </section>

      {/* 3. SECTION BARU: KENAPA MEMILIH KAMI (Interactive Cards) */}
      <section className="px-6 md:px-12 py-32 bg-[#f8f7f3]">
        
        {/* Judul Section */}
        <div className="mb-16 md:flex justify-between items-end pb-8 border-b-2 border-[#02253d]">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-[#02253d] mb-6 md:mb-0">
            Mengapa Harus <br/> <span className="text-[#2f496e]">Produk Kami?</span>
          </h2>
          <p className="text-[#2f496e] font-bold text-xl max-w-md text-left md:text-right">
            Tiga alasan utama mengapa kami berbeda dari yang lain.
          </p>
        </div>

        {/* Grid Kartu Interaktif */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((item, index) => (
            // 'group' digunakan agar hover pada parent bisa mempengaruhi child
            <div 
              key={index}
              className={`group relative p-10 border-2 border-[#02253d] bg-[#f8f7f3] text-[#02253d] transition-all duration-500 ease-in-out hover:${item.bgColor} hover:text-[#f8f7f3] hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(2,37,61,1)] cursor-default overflow-hidden`}
            >
              {/* Ikon Panah di Pojok Kanan Atas (Muncul saat hover) */}
              <ArrowUpRight className="absolute top-6 right-6 w-8 h-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-[#f8f7f3]" />

              {/* Ikon Utama */}
              <div className="mb-6 text-[#2f496e] group-hover:text-[#f8f7f3] transition-colors duration-500">
                {item.icon}
              </div>

              {/* Judul Kartu */}
              <h3 className="text-3xl font-black mb-4 leading-tight group-hover:translate-y-[-0.5rem] transition-transform duration-500">
                {item.title}
              </h3>

              {/* Deskripsi (Muncul perlahan saat hover) */}
              {/* Trik: gunakan max-h-0 lalu ubah jadi max-h-screen agar animasinya mulus */}
              <div className="max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-700 ease-in-out overflow-hidden">
                <p className="font-medium text-lg leading-relaxed opacity-90">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}