"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { createClient } from "@/lib/supabase/client";
import { Sprout, HeartHandshake, ShieldCheck, ArrowUpRight, Loader2 } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const dynamic = 'force-dynamic';

// --- DATA: Ditambahkan Full Hover Class agar tidak "Gaib" ---
const reasons = [
  {
    icon: <Sprout className="w-12 h-12" />,
    title: "Murni dari Alam",
    description: "Produk kami berasal dari kambing yang diberi pakan alami berkualitas, tanpa bahan kimia berbahaya. Kesegaran terjamin langsung dari kandang ke tangan Anda.",
    hoverClass: "hover:bg-[#c2b2a3]", // Ditulis lengkap di sini
  },
  {
    icon: <HeartHandshake className="w-12 h-12" />,
    title: "Pemberdayaan Desa",
    description: "Setiap pembelian Anda secara langsung membantu meningkatkan ekonomi peternak kecil di desa dan membuka lapangan kerja baru bagi masyarakat sekitar.",
    hoverClass: "hover:bg-[#2f496e]",
  },
  {
    icon: <ShieldCheck className="w-12 h-12" />,
    title: "Kualitas Terjamin",
    description: "Proses pemerahan, pemotongan, hingga pengemasan dilakukan dengan standar kebersihan yang ketat dan diawasi oleh tenaga ahli.",
    hoverClass: "hover:bg-[#94afc9]",
  },
];

export default function Home() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .limit(5)
        .order('created_at', { ascending: false });
      
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [supabase]);

  const getCarouselStyle = (index: number) => {
    const styles = [
      { bg: "bg-[#2f496e]", text: "text-[#f8f7f3]", accent: "text-[#94afc9]" },
      { bg: "bg-[#c2b2a3]", text: "text-[#02253d]", accent: "text-[#02253d]" },
      { bg: "bg-[#94afc9]", text: "text-[#02253d]", accent: "text-[#02253d]" }
    ];
    return styles[index % styles.length];
  };

  return (
    <>
      {/* 1. HERO SECTION (Kalimat Menarik & Tanpa Tombol) */}
      <header className="relative px-6 py-32 md:py-48 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Foto/bg.jpeg"
            alt="Latar Belakang Peternakan"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized // Mencegah Private IP Error
          />
          <div className="absolute inset-0 bg-[#f8f7f3]/85 backdrop-blur-sm z-10"></div>
        </div>

        <div className="relative z-20 flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight text-[#02253d]">
            Kualitas Kandang, <br />
            <span className="text-[#2f496e]">Kepercayaan Anda.</span>
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mb-10 text-[#2f496e] font-medium leading-relaxed">
            Pojok Cerdas bukan sekadar toko. Kami adalah ruang bagi peternak lokal untuk menghadirkan produk terbaiknya—susu murni, daging segar, dan pupuk organik—langsung ke pintu rumah Anda tanpa perantara. Bersama, kita bangun ekonomi desa yang lebih kuat.
          </p>
          <div className="flex gap-4 items-center">
            <div className="h-1 w-12 bg-[#02253d]"></div>
            <span className="text-sm font-black uppercase tracking-widest text-[#02253d]">Hasil Murni Peternakan Desa</span>
            <div className="h-1 w-12 bg-[#02253d]"></div>
          </div>
        </div>
      </header>

      {/* 2. CAROUSEL PRODUK (DATA DARI SUPABASE) */}
      <section className="px-6 md:px-12 py-24 bg-[#f8f7f3] border-b-2 border-[#02253d]">
        {loading ? (
          <div className="min-h-[500px] flex items-center justify-center border-2 border-[#02253d]">Memuat...</div>
        ) : (
          <Carousel plugins={[plugin.current]} className="w-full">
            <CarouselContent>
              {products.map((product, index) => {
                const style = getCarouselStyle(index);
                return (
                  <CarouselItem key={product.id}>
                    <div className={`grid grid-cols-1 md:grid-cols-2 min-h-[500px] ${style.bg} ${style.text} border-2 border-[#02253d]`}>
                      <div className="p-12 md:p-20 flex flex-col justify-center">
                        <p className={`${style.accent} font-bold mb-4 tracking-widest uppercase text-xs`}>Produk Unggulan</p>
                        <h3 className="text-5xl md:text-6xl font-black mb-6 leading-none uppercase">{product.name}</h3>
                        <p className="text-lg opacity-90 max-w-md font-medium mb-8">{product.description}</p>
                        <span className="text-3xl font-black">Rp {product.price?.toLocaleString('id-ID')} / {product.unit}</span>
                      </div>
                      <div className="relative h-[400px] md:h-full w-full border-t-2 md:border-t-0 md:border-l-2 border-[#02253d]">
                        <Image
                          src={product.image_url || "/Foto/bg.jpeg"}
                          alt={product.name}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        )}
      </section>

      {/* 3. SECTION: KENAPA MEMILIH KAMI (FIXED HOVER) */}
      <section className="px-6 md:px-12 py-32 bg-[#f8f7f3]">
        <div className="mb-16 md:flex justify-between items-end pb-8 border-b-2 border-[#02253d]">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-[#02253d]">
            Mengapa Harus <br/> <span className="text-[#2f496e]">Produk Kami?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((item, index) => (
            <div 
              key={index}
              className={`group relative p-10 border-2 border-[#02253d] bg-[#f8f7f3] text-[#02253d] transition-all duration-500 ease-in-out ${item.hoverClass} hover:text-[#f8f7f3] hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(2,37,61,1)] cursor-default overflow-hidden`}
            >
              <ArrowUpRight className="absolute top-6 right-6 w-8 h-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-[#f8f7f3]" />
              <div className="mb-6 text-[#2f496e] group-hover:text-[#f8f7f3] transition-colors duration-500">
                {item.icon}
              </div>
              <h3 className="text-3xl font-black mb-4 leading-tight group-hover:translate-y-[-0.5rem] transition-transform duration-500">
                {item.title}
              </h3>
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