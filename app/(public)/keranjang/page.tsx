"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateCartItem, removeCartItem, checkoutCart, updatePaymentStatusLokal } from "@/app/auth/actions";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, MapPin, Truck, Store, Loader2, CheckCircle2, Clock, X } from "lucide-react";
import Script from "next/script";


export default function KeranjangPage() {
  const supabase = createClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State Data Real
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State Pilihan Pengiriman
  const [deliveryMethod, setDeliveryMethod] = useState<'Antar ke Rumah' | 'Ambil di Toko'>('Antar ke Rumah');

  const [paymentAlert, setPaymentAlert] = useState<{show: boolean, status: 'success'|'pending'|'error'|'closed', message: string} | null>(null);

  const fetchCartAndProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Ambil Profil
      const { data: userProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(userProfile);

      // Ambil Keranjang berserta relasi ke tabel produk
      const { data: items } = await supabase
        .from('cart_items')
        .select('*, products(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (items) setCartItems(items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCartAndProfile();
  }, []);

  // --- HANDLER INTERAKSI ---
  const handleUpdateQuantity = async (id: string, currentQty: number, type: 'increase' | 'decrease') => {
    const newQty = type === 'increase' ? currentQty + 1 : currentQty - 1;
    if (newQty < 1) return; // Minimal 1
    
    // Update UI instan biar terasa cepat
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    // Update Database
    await updateCartItem(id, newQty);
  };

  const handleRemove = async (id: string) => {
    // 1. Update tampilan keranjang secara instan
    setCartItems(cartItems.filter(item => item.id !== id)); 
    
    // 2. Hapus dari database
    await removeCartItem(id); 
    
    // 3. --- ALAT TELEPATI: PEMANCAR SINYAL ---
    // Berteriak ke Navbar bahwa keranjang baru saja berubah!
    window.dispatchEvent(new Event('cartChanged')); 
  };

  const handleCheckout = () => {
    if (deliveryMethod === 'Antar ke Rumah' && !profile?.address) {
      alert("Harap lengkapi alamat pengiriman di menu Profil terlebih dahulu!");
      router.push('/profil');
      return;
    }

    startTransition(async () => {
      const res = await checkoutCart(deliveryMethod, totalAkhir, profile?.address);
      
      if (res.success && res.token) {
        // --- MEMANGGIL POP-UP MIDTRANS MELAYANG ---
        // Kita menggunakan (window as any) agar TypeScript tidak protes
        (window as any).snap.pay(res.token, {
          onSuccess: async function(result: any){
            await updatePaymentStatusLokal(res.orderId); 
            // GANTI ALERT DENGAN INI:
            setPaymentAlert({show: true, status: 'success', message: 'Pembayaran berhasil diproses!'});
          },
          onPending: function(result: any){
            setPaymentAlert({show: true, status: 'pending', message: 'Menunggu pembayaran Anda!'});
          },
          onError: function(result: any){
            setPaymentAlert({show: true, status: 'error', message: 'Pembayaran gagal!'});
          },
          onClose: function(){
            setPaymentAlert({show: true, status: 'closed', message: 'Anda menutup popup tanpa menyelesaikan pembayaran.'});
          }
        });
      } else {
        alert("Gagal checkout: " + res.error);
      }
    });
  };

  // --- PERHITUNGAN HARGA ---
  const subTotal = cartItems.reduce((acc, item) => acc + (item.products?.price * item.quantity), 0);
  // Ongkir Rp 25.000 hanya jika pilih Antar ke Rumah
  const ongkosKirim = (cartItems.length > 0 && deliveryMethod === 'Antar ke Rumah') ? 25000 : 0; 
  const totalAkhir = subTotal + ongkosKirim;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka || 0);
  };

  if (loading) return <div className="min-h-screen bg-[#f8f7f3] p-20 text-center font-black uppercase text-2xl text-[#02253d]">Memeriksa Keranjang...</div>;

  return (

    <>
      {/* SUNTIKAN SCRIPT MIDTRANS */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

    <div className="bg-[#f8f7f3] min-h-screen pb-24 font-sans selection:bg-[#94afc9]">
      {/* HEADER KERANJANG */}
      <header className="px-6 md:px-12 py-16 border-b-4 border-[#02253d] mb-12 bg-white">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-[#02253d] flex items-center gap-6">
          <ShoppingBag className="w-16 h-16 md:w-24 md:h-24 text-[#94afc9]" />
          <div>Keranjang <br /> <span className="text-[#2f496e]">Belanja.</span></div>
        </h1>
      </header>

      <main className="px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* BAGIAN KIRI: DAFTAR BARANG */}
          <div className="lg:col-span-2 space-y-8">
            {cartItems.length === 0 ? (
              <div className="border-4 border-[#02253d] bg-white p-12 text-center shadow-[12px_12px_0px_0px_rgba(2,37,61,1)]">
                <ShoppingBag className="w-24 h-24 text-[#94afc9] mx-auto mb-6 opacity-50" />
                <h2 className="text-4xl font-black text-[#02253d] uppercase mb-4">Keranjang Kosong</h2>
                <p className="text-[#2f496e] font-bold text-lg mb-8">Anda belum memasukkan produk apapun ke keranjang.</p>
                <Link href="/katalog" className="inline-block bg-[#02253d] text-white px-10 py-4 font-black text-xl uppercase hover:bg-[#2f496e] transition-colors shadow-[6px_6px_0px_0px_rgba(194,178,163,1)]">
                  Mulai Belanja
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row border-4 border-[#02253d] bg-white shadow-[12px_12px_0px_0px_rgba(2,37,61,1)] group relative overflow-hidden transition-all">
                  
                  {/* Foto Produk Real */}
                  <div className="relative w-full md:w-48 h-48 border-b-4 md:border-b-0 md:border-r-4 border-[#02253d] shrink-0 bg-[#c2b2a3]">
                    <Image 
                      src={item.products?.image_url || "/Foto/bg.jpeg"} 
                      alt={item.products?.name} 
                      fill 
                      unoptimized 
                      className="object-cover mix-blend-multiply" 
                    />
                    <div className="absolute top-0 left-0 bg-[#02253d] text-white px-3 py-1 text-[10px] font-black uppercase">
                      {item.products?.category}
                    </div>
                  </div>

                  {/* Detail & Kontrol */}
                  <div className="p-6 md:p-8 flex flex-col justify-between w-full">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-3xl font-black text-[#02253d] uppercase tracking-tighter leading-none mb-2">
                          {item.products?.name}
                        </h3>
                        <p className="text-xl font-bold text-[#94afc9]">
                          {formatRupiah(item.products?.price)} <span className="text-sm">/ {item.products?.unit}</span>
                        </p>
                      </div>
                      <button onClick={() => handleRemove(item.id)} className="p-3 border-4 border-[#02253d] bg-[#f8f7f3] text-red-600 hover:bg-red-600 hover:text-white transition-colors" title="Hapus Barang">
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-8">
                      <div className="flex items-center border-4 border-[#02253d] bg-[#f8f7f3]">
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity, 'decrease')} className="w-12 h-12 flex items-center justify-center hover:bg-[#c2b2a3] transition-colors border-r-4 border-[#02253d] text-[#02253d]">
                          <Minus className="w-5 h-5 font-black" />
                        </button>
                        <div className="w-16 h-12 flex items-center justify-center font-black text-2xl text-[#02253d] bg-white">
                          {item.quantity}
                        </div>
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity, 'increase')} className="w-12 h-12 flex items-center justify-center hover:bg-[#c2b2a3] transition-colors border-l-4 border-[#02253d] text-[#02253d]">
                          <Plus className="w-5 h-5 font-black" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest mb-1">Subtotal Item</p>
                        <p className="text-2xl font-black text-[#02253d]">{formatRupiah(item.products?.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* BAGIAN KANAN: RINGKASAN & PENGIRIMAN */}
          <div className="lg:sticky lg:top-32 space-y-8">
            
            {/* OPSI METODE PENGIRIMAN (FITUR BARU) */}
            {cartItems.length > 0 && (
              <div className="bg-white border-4 border-[#02253d] p-6 shadow-[8px_8px_0px_0px_rgba(2,37,61,1)]">
                <h3 className="font-black text-[#02253d] uppercase mb-4 tracking-tighter text-xl">Pilih Metode Pengiriman</h3>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setDeliveryMethod('Antar ke Rumah')}
                    className={`flex items-center gap-3 p-4 border-4 border-[#02253d] font-black uppercase text-sm transition-all ${deliveryMethod === 'Antar ke Rumah' ? 'bg-[#02253d] text-white' : 'bg-[#f8f7f3] text-[#02253d] hover:bg-[#c2b2a3]'}`}
                  >
                    <Truck className="w-5 h-5" /> Antar ke Rumah (Rp 25.000)
                  </button>
                  <button 
                    onClick={() => setDeliveryMethod('Ambil di Toko')}
                    className={`flex items-center gap-3 p-4 border-4 border-[#02253d] font-black uppercase text-sm transition-all ${deliveryMethod === 'Ambil di Toko' ? 'bg-[#02253d] text-white' : 'bg-[#f8f7f3] text-[#02253d] hover:bg-[#c2b2a3]'}`}
                  >
                    <Store className="w-5 h-5" /> Ambil di Kandang (Gratis)
                  </button>
                </div>
              </div>
            )}

            {/* INFO ALAMAT DINAMIS */}
            {cartItems.length > 0 && (
              <div className="border-4 border-[#02253d] bg-white p-6 shadow-[8px_8px_0px_0px_rgba(2,37,61,1)]">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-[#2f496e]" />
                  <h3 className="font-black text-[#02253d] uppercase">
                    {deliveryMethod === 'Antar ke Rumah' ? 'Alamat Tujuan:' : 'Alamat Pengambilan:'}
                  </h3>
                </div>
                
                {deliveryMethod === 'Antar ke Rumah' ? (
                  <>
                    <p className="text-[#2f496e] font-bold text-sm leading-relaxed mb-4">
                      <strong>{profile?.full_name || 'Pembeli'}</strong> (+62 {profile?.phone_number || '-'})<br/>
                      {profile?.address || <span className="text-red-600">Alamat belum diatur. Harap isi profil Anda.</span>}
                    </p>
                    <Link href="/profil" className="text-xs font-black text-[#94afc9] hover:text-[#02253d] uppercase tracking-widest underline decoration-2 underline-offset-4">
                      Ubah Data Pengiriman
                    </Link>
                  </>
                ) : (
                  <p className="text-[#2f496e] font-bold text-sm leading-relaxed">
                    <strong>Pojok Cerdas Agroindustri</strong><br/>
                    Jl. Raya Desa Makmur No. 45, Kec. Agribisnis, Jawa Timur.<br/>
                    <span className="text-[#94afc9] text-xs mt-2 block italic">*Tunjukkan bukti pesanan saat pengambilan.</span>
                  </p>
                )}
              </div>
            )}

            {/* RINGKASAN PEMBAYARAN */}
            <div className="border-4 border-[#02253d] bg-[#02253d] text-white p-8 shadow-[12px_12px_0px_0px_rgba(194,178,163,1)]">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 border-b-4 border-[#2f496e] pb-4">
                Ringkasan <br/> Pesanan
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-lg font-bold text-[#94afc9]">
                  <span>Subtotal Barang</span>
                  <span>{formatRupiah(subTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-[#94afc9]">
                  <span>Estimasi Ongkir</span>
                  <span>{formatRupiah(ongkosKirim)}</span>
                </div>
              </div>

              <div className="border-t-4 border-[#2f496e] pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-xl font-black uppercase text-[#94afc9]">Total Bayar</span>
                  <span className="text-4xl font-black text-[#f8f7f3]">{formatRupiah(totalAkhir)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isPending}
                className="w-full bg-[#f8f7f3] text-[#02253d] py-5 text-xl font-black uppercase hover:bg-[#c2b2a3] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-transparent hover:border-[#02253d] group"
              >
                {isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>Checkout Sekarang <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" /></>
                )}
              </button>
            </div>

          </div>
        </div>
        {/* --- POP-UP NOTIFIKASI CUSTOM BRUTALIST --- */}
        {paymentAlert?.show && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#02253d]/80 backdrop-blur-sm p-6">
            <div className="bg-[#f8f7f3] border-4 border-[#02253d] shadow-[16px_16px_0px_0px_rgba(194,178,163,1)] max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-300">
              
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-4 border-[#02253d] bg-white shadow-[8px_8px_0px_0px_rgba(2,37,61,1)]">
                {paymentAlert.status === 'success' && <CheckCircle2 className="w-10 h-10 text-green-500" />}
                {paymentAlert.status === 'pending' && <Clock className="w-10 h-10 text-yellow-500" />}
                {(paymentAlert.status === 'error' || paymentAlert.status === 'closed') && <X className="w-10 h-10 text-red-500" />}
              </div>
              
              <h2 className="text-3xl font-black text-[#02253d] uppercase tracking-tighter mb-4">
                {paymentAlert.status === 'success' ? 'Berhasil!' : 
                 paymentAlert.status === 'pending' ? 'Menunggu!' : 'Dibatalkan'}
              </h2>
              
              <p className="text-[#2f496e] font-bold text-lg mb-8 leading-relaxed">
                {paymentAlert.message}
              </p>

              <button 
                onClick={() => {
                  setPaymentAlert(null);
                  if(paymentAlert.status === 'success' || paymentAlert.status === 'pending'){
                    router.push('/profil'); // Pindah halaman HANYA JIKA ditekan OK
                  }
                }}
                className="w-full bg-[#02253d] text-white py-4 font-black text-xl uppercase hover:bg-[#2f496e] border-4 border-[#02253d] transition-all shadow-[6px_6px_0px_0px_rgba(194,178,163,1)] active:translate-y-1 active:shadow-none"
              >
                OKE, MENGERTI
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
    </>
  );
}