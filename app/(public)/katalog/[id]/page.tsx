"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Tambahan useRouter
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { 
  ShoppingCart, 
  MessageCircle, 
  Scale, 
  ShieldCheck, 
  Zap, 
  ArrowLeft, 
  Leaf,
  Loader2
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function DetailProduk() {
  const params = useParams();
  const router = useRouter(); // Inisialisasi Router
  const id = params.id as string;
  const supabase = createClient();

  // --- STATE DATA REAL ---
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false); // State loading untuk tombol keranjang

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setProduct({
          ...data,
          images: [data.image_url, "/Foto/bg.jpeg"], 
          specs: [
            { label: "Sisa Stok", value: `${data.stock} Unit`, icon: <Scale /> },
            { label: "Kategori", value: data.category, icon: <Zap /> },
            { label: "Kualitas", value: "Premium/Fresh", icon: <ShieldCheck /> },
            { label: "Satuan", value: data.unit, icon: <Leaf /> }
          ]
        });
      }
      setLoading(false);
    };

    if (id) fetchProductDetail();
  }, [id, supabase]);

  // --- MESIN TAMBAH KE KERANJANG ---
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      // 1. Cek User Login
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Silakan login terlebih dahulu untuk mulai berbelanja!");
        router.push("/login");
        return;
      }

      // 2. Cek apakah barang sudah ada di keranjang user
      const { data: existingCartItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      if (existingCartItem) {
        // Jika sudah ada, tambah quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingCartItem.quantity + 1 })
          .eq('id', existingCartItem.id);
        if (error) throw error;
      } else {
        // Jika belum ada, masukkan sebagai barang baru
        const { error } = await supabase
          .from('cart_items')
          .insert([{ 
            user_id: user.id, 
            product_id: product.id, 
            quantity: 1 
          }]);
        if (error) throw error;
      }

      // 3. Sukses & Pindah ke Keranjang
      router.push("/keranjang");

    } catch (error: any) {
      alert("Gagal menambahkan ke keranjang: " + error.message);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f3] flex flex-col items-center justify-center gap-4 font-black uppercase tracking-widest text-[#02253d]">
        <Loader2 className="w-12 h-12 animate-spin" />
        Membuka Detail Produk...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f7f3] flex flex-col items-center justify-center p-20 text-center font-black">
        <h2 className="text-4xl text-[#02253d] uppercase mb-8">Produk Tidak Ditemukan!</h2>
        <Link href="/katalog" className="bg-[#02253d] text-white px-8 py-4 uppercase">Kembali ke Katalog</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f7f3] min-h-screen">
      <div className="px-6 md:px-12 py-8">
        <Link href="/katalog" className="inline-flex items-center gap-2 font-black uppercase text-[#02253d] hover:text-[#94afc9] transition-colors">
          <ArrowLeft className="w-6 h-6" /> Kembali ke Katalog
        </Link>
      </div>

      <main className="px-6 md:px-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* KIRI: CAROUSEL */}
        <div className="w-full">
          <Carousel className="w-full">
            <CarouselContent className="border-4 border-[#02253d] bg-white shadow-[12px_12px_0px_0px_rgba(2,37,61,1)]">
              {product.images.map((img: string, index: number) => (
                <CarouselItem key={index} className="relative h-[400px] md:h-[600px] w-full">
                  <Image 
                    src={img || "/Foto/bg.jpeg"} 
                    alt={`${product.name} - ${index + 1}`} 
                    fill 
                    unoptimized 
                    className="object-cover" 
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            
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
             <h3 className="text-5xl font-black">
               Rp {product.price?.toLocaleString("id-ID")}
               <span className="text-2xl opacity-50"> / {product.unit}</span>
             </h3>
          </div>

          <p className="text-2xl text-[#2f496e] font-medium leading-relaxed mb-12 border-l-8 border-[#c2b2a3] pl-8">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-16">
            {product.specs.map((spec: any) => (
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
            {/* TOMBOL TAMBAH KERANJANG (SUDAH AKTIF) */}
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 bg-[#02253d] text-white py-8 text-2xl font-black hover:bg-[#2f496e] transition-all shadow-[8px_8px_0px_0px_rgba(148,175,201,1)] uppercase flex items-center justify-center gap-4 active:translate-y-1 active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <><Loader2 className="w-8 h-8 animate-spin" /> Menambahkan...</>
              ) : (
                <><ShoppingCart className="w-8 h-8" /> Tambah Keranjang</>
              )}
            </button>

            <a 
              href={`https://wa.me/6281234567890?text=Halo, saya ingin bertanya tentang ${product.name}`} 
              target="_blank"
              rel="noopener noreferrer"
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