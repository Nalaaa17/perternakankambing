"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShoppingCart, Info, Loader2 } from "lucide-react";

export default function KatalogPage() {
  const supabase = createClient();
  const router = useRouter();
  
  // --- STATE DATA REAL ---
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. Cek Sesi User
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      // 2. Ambil Produk dari Database
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setProducts(data);
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  // --- LOGIKA TOMBOL BELI ---
  const handleBuy = (productId: string) => {
    if (!user) {
      // Jika belum login, tendang ke halaman login
      router.push("/login");
    } else {
      // Jika sudah login, lanjut ke detail/keranjang
      router.push(`/katalog/${productId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f3] flex flex-col items-center justify-center gap-4 font-black uppercase tracking-widest text-[#02253d]">
        <Loader2 className="w-12 h-12 animate-spin" />
        Memuat Produk Unggulan...
      </div>
    );
  }

  return (
    <div className="bg-[#f8f7f3] min-h-screen pb-24 font-sans selection:bg-[#94afc9]">
      {/* HEADER TETAP BRUTALIST */}
      <header className="px-6 md:px-12 py-16 border-b-4 border-[#02253d] mb-12 bg-white">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-[#02253d]">
          Katalog <br /> <span className="text-[#2f496e]">Produk Unggulan.</span>
        </h1>
      </header>

      <section className="px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12">
          {products.length === 0 ? (
            <div className="p-20 text-center border-4 border-dashed border-[#02253d] font-black uppercase text-[#94afc9]">
              Belum ada produk yang tersedia.
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="grid grid-cols-1 lg:grid-cols-2 border-4 border-[#02253d] bg-white group hover:shadow-[16px_16px_0px_0px_rgba(2,37,61,1)] transition-all duration-500 overflow-hidden">
                
                {/* GAMBAR PRODUK REAL */}
                <div className="relative h-[400px] lg:h-[500px] border-b-4 lg:border-b-0 lg:border-r-4 border-[#02253d]">
                  <Image 
                    src={product.image_url || "/Foto/bg.jpeg"} 
                    alt={product.name} 
                    fill 
                    unoptimized // Mencegah Private IP Error
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover" 
                  />
                  <div className="absolute top-6 left-6 bg-[#02253d] text-white px-6 py-2 font-black text-sm uppercase z-10 skew-x-[-12deg]">
                    {product.category}
                  </div>
                </div>

                {/* INFO PRODUK */}
                <div className="p-8 md:p-14 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-3 mb-6">
                      <span className="text-xs font-black bg-[#c2b2a3] text-[#02253d] px-3 py-1 uppercase border-2 border-[#02253d]">Higenis</span>
                      <span className="text-xs font-black bg-[#c2b2a3] text-[#02253d] px-3 py-1 uppercase border-2 border-[#02253d]">Fresh</span>
                    </div>
                    <h2 className="text-5xl font-black text-[#02253d] mb-6 leading-none tracking-tighter uppercase">{product.name}</h2>
                    <p className="text-xl text-[#2f496e] mb-10 font-medium leading-relaxed">{product.description}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-10 border-t-4 border-[#02253d]/10">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-[#94afc9] uppercase tracking-widest">Harga Jual</span>
                      <span className="text-4xl font-black text-[#02253d]">
                        Rp {product.price?.toLocaleString("id-ID")}
                        <span className="text-xl opacity-40"> / {product.unit}</span>
                      </span>
                    </div>
                    
                    <div className="flex w-full sm:w-auto gap-4">
                      {/* DETAIL */}
                      <Link href={`/katalog/${product.id}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#f8f7f3] border-4 border-[#02253d] text-[#02253d] px-8 py-5 font-black hover:bg-[#c2b2a3] transition-all uppercase text-center">
                        <Info className="w-6 h-6" /> Detail
                      </Link>

                      {/* TOMBOL BELI DENGAN CEK LOGIN */}
                      <button 
                        onClick={() => handleBuy(product.id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#02253d] text-white px-10 py-5 font-black hover:bg-[#2f496e] transition-all shadow-[6px_6px_0px_0px_rgba(194,178,163,1)] uppercase active:translate-y-1 active:shadow-none"
                      >
                        <ShoppingCart className="w-6 h-6" /> Beli
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}