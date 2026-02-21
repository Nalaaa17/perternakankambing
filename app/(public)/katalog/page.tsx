"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link"; // Tambahkan ini
import { ShoppingCart, Info, Scale, ShieldCheck, Zap } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Data 3 Produk (Daging, Susu, Pupuk)
export const catalogProducts = [
  {
    id: "daging-segar",
    name: "Daging Kambing Segar",
    price: "Rp 155.000",
    unit: "/ Kg",
    category: "Daging Premium",
    description: "Daging kambing muda pilihan dengan tekstur empuk dan aroma tidak prengus.",
    image: "/Foto/dg.jpg",
    tags: ["Higenis", "Fresh"],
  },
  {
    id: "susu-murni",
    name: "Susu Kambing Murni",
    price: "Rp 35.000",
    unit: "/ Liter",
    category: "Minuman Sehat",
    description: "Susu kambing etawa segar hasil perahan pagi hari tanpa campuran air.",
    image: "/Foto/susu.jpeg",
    tags: ["100% Murni", "Tanpa Pengawet"],
  },
  {
    id: "pupuk-organik",
    name: "Pupuk Organik Cair",
    price: "Rp 45.000",
    unit: "/ Botol",
    category: "Pertanian",
    description: "Pupuk hasil fermentasi urin dan kotoran kambing untuk hasil panen melimpah.",
    image: "/Foto/Pupuk.jpeg",
    tags: ["Eco-Friendly", "Organik"],
  }
];

export default function KatalogPage() {
  return (
    <div className="bg-[#f8f7f3] min-h-screen pb-24">
      <header className="px-6 md:px-12 py-16 border-b-4 border-[#02253d] mb-12 bg-white">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-[#02253d]">
          Katalog <br /> <span className="text-[#2f496e]">Produk Unggulan.</span>
        </h1>
      </header>

      <section className="px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12">
          {catalogProducts.map((product) => (
            <div key={product.id} className="grid grid-cols-1 lg:grid-cols-2 border-4 border-[#02253d] bg-white group hover:shadow-[16px_16px_0px_0px_rgba(2,37,61,1)] transition-all duration-500 overflow-hidden">
              <div className="relative h-[400px] lg:h-[500px] border-b-4 lg:border-b-0 lg:border-r-4 border-[#02253d]">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
                <div className="absolute top-6 left-6 bg-[#02253d] text-white px-6 py-2 font-black text-sm uppercase z-10 skew-x-[-12deg]">
                  {product.category}
                </div>
              </div>

              <div className="p-8 md:p-14 flex flex-col justify-between">
                <div>
                  <div className="flex gap-3 mb-6">
                    {product.tags.map(tag => (
                      <span key={tag} className="text-xs font-black bg-[#c2b2a3] text-[#02253d] px-3 py-1 uppercase border-2 border-[#02253d]">{tag}</span>
                    ))}
                  </div>
                  <h2 className="text-5xl font-black text-[#02253d] mb-6 leading-none tracking-tighter uppercase">{product.name}</h2>
                  <p className="text-xl text-[#2f496e] mb-10 font-medium leading-relaxed">{product.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-10 border-t-4 border-[#02253d]/10">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-[#94afc9] uppercase tracking-widest">Harga Jual</span>
                    <span className="text-4xl font-black text-[#02253d]">{product.price}<span className="text-xl opacity-40"> {product.unit}</span></span>
                  </div>
                  
                  <div className="flex w-full sm:w-auto gap-4">
                    {/* TOMBOL DETAIL MENGARAH KE HALAMAN BARU */}
                    <Link href={`/katalog/${product.id}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#f8f7f3] border-4 border-[#02253d] text-[#02253d] px-8 py-5 font-black hover:bg-[#c2b2a3] transition-all uppercase text-center">
                      <Info className="w-6 h-6" /> Detail
                    </Link>

                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#02253d] text-white px-10 py-5 font-black hover:bg-[#2f496e] transition-all shadow-[6px_6px_0px_0px_rgba(194,178,163,1)] uppercase">
                      <ShoppingCart className="w-6 h-6" /> Beli
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}