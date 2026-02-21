"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingCart, 
  MessageCircle, 
  Scale, 
  ShieldCheck, 
  Zap, 
  ArrowLeft, 
  Leaf,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";

// Import komponen Carousel dari folder components/ui yang sudah kamu install
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const productData = {
  "daging-segar": {
    name: "Daging Kambing Segar",
    price: "Rp 155.000",
    unit: "/ Kg",
    category: "Daging Premium",
    longDescription: "Daging dipotong langsung dari peternakan kami setiap pagi untuk menjamin kesegaran maksimal. Melalui proses pelayuan (aging) yang tepat untuk menghasilkan tekstur yang sangat empuk. Cocok untuk sate, gulai, maupun steak premium.",
    // Tambahkan beberapa foto untuk carousel
    images: ["/Foto/dg.jpg", "/Foto/bg.jpeg", "/Foto/dg.jpg"], 
    specs: [
      { label: "Berat", value: "1.0 Kg", icon: <Scale /> },
      { label: "Kondisi", value: "Segar/Chill", icon: <Zap /> },
      { label: "Sertifikat", value: "Halal MUI", icon: <ShieldCheck /> },
      { label: "Kemasan", value: "Vacuum Pack", icon: <Leaf /> }
    ]
  },
  "susu-murni": {
    name: "Susu Kambing Murni",
    price: "Rp 35.000",
    unit: "/ Liter",
    category: "Minuman Sehat",
    longDescription: "Susu diperah secara manual namun higienis setiap pagi. Kami menjaga suhu susu tetap dingin segera setelah diperah untuk menjaga nutrisi enzim alaminya.",
    images: ["/Foto/susu.jpeg", "/Foto/bg.jpeg"],
    specs: [
      { label: "Volume", value: "1 Liter", icon: <Scale /> },
      { label: "Masa Simpan", value: "3-4 Hari", icon: <Zap /> },
      { label: "Higiene", value: "Sangat Baik", icon: <ShieldCheck /> },
      { label: "Rasa", value: "Original", icon: <Leaf /> }
    ]
  },
  "pupuk-organik": {
    name: "Pupuk Organik Cair",
    price: "Rp 45.000",
    unit: "/ Botol",
    category: "Pertanian",
    longDescription: "Pupuk hasil fermentasi urin dan kotoran kambing untuk hasil panen melimpah. Diproses melalui fermentasi aerob selama 21 hari.",
    images: ["/Foto/Pupuk.jpeg", "/Foto/bg.jpeg"],
    specs: [
      { label: "Isi", value: "500 ml", icon: <Scale /> },
      { label: "Efektivitas", value: "Sangat Cepat", icon: <Zap /> },
      { label: "Keamanan", value: "Ramah Lingkungan", icon: <ShieldCheck /> },
      { label: "Jenis", value: "Fermentasi", icon: <Leaf /> }
    ]
  }
};

export default function DetailProduk() {
  const params = useParams();
  const id = params.id as string;
  const product = productData[id as keyof typeof productData];

  if (!product) return <div className="p-20 text-center font-black">Produk Tidak Ditemukan!</div>;

  return (
    <div className="bg-[#f8f7f3] min-h-screen">
      {/* NAVIGATION BACK */}
      <div className="px-6 md:px-12 py-8">
        <Link href="/katalog" className="inline-flex items-center gap-2 font-black uppercase text-[#02253d] hover:text-[#94afc9] transition-colors">
          <ArrowLeft className="w-6 h-6" /> Kembali ke Katalog
        </Link>
      </div>

      <main className="px-6 md:px-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* KIRI: CAROUSEL GALERI RAKSASA */}
        <div className="w-full">
          <Carousel className="w-full">
            <CarouselContent className="border-4 border-[#02253d] bg-white shadow-[12px_12px_0px_0px_rgba(2,37,61,1)]">
              {product.images.map((img, index) => (
                <CarouselItem key={index} className="relative h-[400px] md:h-[600px] w-full">
                  <Image 
                    src={img} 
                    alt={`${product.name} - ${index + 1}`} 
                    fill 
                    className="object-cover" 
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Tombol Navigasi Carousel yang Disesuaikan dengan Tema Brutalist */}
            <div className="flex gap-4 mt-6">
              <CarouselPrevious className="static translate-y-0 bg-[#02253d] text-white border-none rounded-none w-14 h-14 hover:bg-[#2f496e]" />
              <CarouselNext className="static translate-y-0 bg-[#02253d] text-white border-none rounded-none w-14 h-14 hover:bg-[#2f496e]" />
            </div>
          </Carousel>
        </div>

        {/* KANAN: INFO PRODUK */}
        <div className="flex flex-col">
          <span className="text-sm font-black text-[#94afc9] uppercase tracking-[0.4em] mb-4">{product.category}</span>
          <h1 className="text-6xl md:text-8xl font-black text-[#02253d] leading-none tracking-tighter uppercase mb-8">
            {product.name}
          </h1>
          
          <div className="bg-[#02253d] text-white p-8 mb-12 skew-x-[-2deg] border-l-8 border-[#94afc9]">
             <span className="text-xs font-bold uppercase opacity-60">Harga Spesial</span>
             <h3 className="text-5xl font-black">{product.price}<span className="text-2xl opacity-50"> {product.unit}</span></h3>
          </div>

          <p className="text-2xl text-[#2f496e] font-medium leading-relaxed mb-12 border-l-8 border-[#c2b2a3] pl-8">
            {product.longDescription}
          </p>

          {/* SPESIFIKASI GRID */}
          <div className="grid grid-cols-2 gap-6 mb-16">
            {product.specs.map((spec) => (
              <div key={spec.label} className="bg-white p-6 border-2 border-[#02253d] shadow-[4px_4px_0px_0px_rgba(2,37,61,1)] flex items-center gap-4">
                <div className="text-[#2f496e] w-8 h-8">{spec.icon}</div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-[#94afc9] uppercase leading-none">{spec.label}</span>
                  <span className="font-black text-[#02253d] text-lg uppercase">{spec.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button className="flex-1 bg-[#02253d] text-white py-8 text-2xl font-black hover:bg-[#2f496e] transition-all shadow-[8px_8px_0px_0px_rgba(148,175,201,1)] uppercase flex items-center justify-center gap-4 active:translate-y-1 active:shadow-none">
              <ShoppingCart className="w-8 h-8" /> Tambah Keranjang
            </button>
            <a 
              href={`https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang ${product.name}`} 
              target="_blank"
              className="flex-1 border-4 border-[#02253d] text-[#02253d] py-8 text-2xl font-black hover:bg-[#c2b2a3] transition-all uppercase flex items-center justify-center gap-4"
            >
              <MessageCircle className="w-8 h-8" /> Tanya Stok
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}