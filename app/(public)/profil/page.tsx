"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/app/auth/actions";
import { 
  User, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  Truck,
  ChevronRight,
  Check,
  Save,
  X,
  Loader2
} from "lucide-react";

export default function ProfilPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'profil' | 'pesanan'>('profil');
  
  // --- STATE DATA USER, PESANAN & EDIT MODE ---
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]); // State untuk pesanan asli
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fungsi untuk mengambil data Profil sekaligus Pesanan dari Database
  const fetchUserDataAndOrders = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 1. Ambil Profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile({ ...profileData, email: user.email });

      // 2. Ambil Pesanan beserta Barang-barangnya
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }); // Urut dari yang terbaru
        
      if (ordersData) setOrders(ordersData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserDataAndOrders();
  }, []);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case "Menunggu": return { bg: "bg-yellow-400", text: "text-[#02253d]", icon: <Clock className="w-4 h-4" /> };
      case "Diverifikasi": return { bg: "bg-blue-500", text: "text-white", icon: <Package className="w-4 h-4" /> };
      case "Dikirim": return { bg: "bg-blue-500", text: "text-white", icon: <Truck className="w-4 h-4" /> };
      case "Selesai": return { bg: "bg-green-500", text: "text-white", icon: <CheckCircle2 className="w-4 h-4" /> };
      default: return { bg: "bg-[#c2b2a3]", text: "text-[#02253d]", icon: <Package className="w-4 h-4" /> };
    }
  };

  // Handler mengubah status pesanan jadi Selesai di Database
  const handleSelesaikanPesanan = async (id: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'Selesai' })
      .eq('id', id);

    if (error) {
      alert("Gagal menyelesaikan pesanan: " + error.message);
    } else {
      alert(`Pesanan telah diselesaikan! Terima kasih telah berbelanja.`);
      fetchUserDataAndOrders(); // Refresh data agar tombolnya hilang
    }
  };

  // Handler untuk menyimpan data profil
  const handleUpdate = async (formData: FormData) => {
    setIsSaving(true);
    const result = await updateProfile(formData);
    if (result.success) {
      await fetchUserDataAndOrders();
      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    } else {
      alert("Gagal memperbarui profil: " + result.error);
    }
    setIsSaving(false);
  };

  // Format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f3] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#02253d] animate-spin" />
        <p className="font-black uppercase tracking-widest text-[#02253d]">Memuat Profil...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f7f3] min-h-screen pb-24 font-sans selection:bg-[#94afc9]">
      
      {/* HEADER PROFIL */}
      <header className="px-6 md:px-12 py-16 border-b-4 border-[#02253d] mb-12 bg-white">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-[#02253d] flex items-center gap-6">
          <User className="w-16 h-16 md:w-24 md:h-24 text-[#94afc9]" />
          <div>
            Akun <br /> <span className="text-[#2f496e]">Saya.</span>
          </div>
        </h1>
      </header>

      <main className="px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* SIDEBAR NAVIGASI (KIRI) */}
          <aside className="w-full lg:w-1/4 flex flex-col gap-4 sticky top-32">
            <button 
              onClick={() => setActiveTab('profil')}
              className={`flex items-center justify-between p-6 border-4 border-[#02253d] font-black uppercase text-lg transition-all ${activeTab === 'profil' ? 'bg-[#02253d] text-white shadow-[8px_8px_0px_0px_rgba(194,178,163,1)]' : 'bg-white text-[#02253d] hover:bg-[#c2b2a3] shadow-[4px_4px_0px_0px_rgba(2,37,61,1)] hover:translate-y-1 hover:shadow-none'}`}
            >
              <div className="flex items-center gap-3"><User className="w-6 h-6" /> Data Diri</div>
              {activeTab === 'profil' && <ChevronRight className="w-6 h-6" />}
            </button>

            <button 
              onClick={() => setActiveTab('pesanan')}
              className={`flex items-center justify-between p-6 border-4 border-[#02253d] font-black uppercase text-lg transition-all ${activeTab === 'pesanan' ? 'bg-[#02253d] text-white shadow-[8px_8px_0px_0px_rgba(194,178,163,1)]' : 'bg-white text-[#02253d] hover:bg-[#c2b2a3] shadow-[4px_4px_0px_0px_rgba(2,37,61,1)] hover:translate-y-1 hover:shadow-none'}`}
            >
              <div className="flex items-center gap-3"><Package className="w-6 h-6" /> Pesanan Saya</div>
              {activeTab === 'pesanan' && <ChevronRight className="w-6 h-6" />}
            </button>
          </aside>

          {/* KONTEN UTAMA (KANAN) */}
          <div className="w-full lg:w-3/4">
            
            {/* --- TAB DATA DIRI --- */}
            {activeTab === 'profil' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <form action={handleUpdate} className="border-4 border-[#02253d] bg-white p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(2,37,61,1)]">
                  <div className="flex justify-between items-end mb-10 border-b-4 border-[#02253d] pb-6">
                    <h2 className="text-4xl font-black text-[#02253d] uppercase tracking-tighter">Informasi Pribadi</h2>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 text-sm font-black text-[#94afc9] hover:text-[#02253d] uppercase transition-colors"
                    >
                      {isEditing ? (
                        <span className="flex items-center gap-2 text-red-500"><X className="w-5 h-5" /> Batal</span>
                      ) : (
                        <span className="flex items-center gap-2"><Edit3 className="w-5 h-5" /> Ubah Data</span>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-[#f8f7f3] border-4 border-[#02253d] p-6 transition-all">
                        <p className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest flex items-center gap-2 mb-2"><User className="w-4 h-4"/> Nama Lengkap</p>
                        {isEditing ? (
                          <input 
                            name="fullName"
                            type="text"
                            defaultValue={profile?.full_name}
                            required
                            className="w-full bg-white border-2 border-[#02253d] p-2 font-black uppercase focus:outline-none focus:bg-[#94afc9]/20"
                          />
                        ) : (
                          <p className="text-2xl font-black text-[#02253d] uppercase">{profile?.full_name || "Belum diatur"}</p>
                        )}
                      </div>
                      <div className="bg-[#f8f7f3] border-4 border-[#02253d] p-6 opacity-80">
                        <p className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest flex items-center gap-2 mb-2"><Mail className="w-4 h-4"/> Alamat Email</p>
                        <p className="text-xl font-bold text-[#02253d]">{profile?.email}</p>
                        {isEditing && <p className="text-[8px] font-bold text-red-500 mt-1">*Email tidak dapat diubah</p>}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-[#f8f7f3] border-4 border-[#02253d] p-6 transition-all">
                        <p className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest flex items-center gap-2 mb-2"><Phone className="w-4 h-4"/> No. WhatsApp</p>
                        {isEditing ? (
                          <input 
                            name="phone"
                            type="text"
                            defaultValue={profile?.phone_number}
                            required
                            className="w-full bg-white border-2 border-[#02253d] p-2 font-bold focus:outline-none focus:bg-[#94afc9]/20"
                          />
                        ) : (
                          <p className="text-xl font-bold text-[#02253d]">{profile?.phone_number || "Belum diatur"}</p>
                        )}
                      </div>
                      <div className="bg-[#02253d] border-4 border-[#02253d] p-6 text-white shadow-[8px_8px_0px_0px_rgba(194,178,163,1)] transition-all">
                        <p className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest flex items-center gap-2 mb-2"><MapPin className="w-4 h-4"/> Alamat Pengiriman</p>
                        {isEditing ? (
                          <textarea 
                            name="address"
                            defaultValue={profile?.address}
                            required
                            rows={2}
                            className="w-full bg-white text-[#02253d] border-2 border-white p-2 font-medium focus:outline-none"
                          />
                        ) : (
                          <p className="text-base font-medium leading-relaxed">
                            {profile?.address || "Alamat pengiriman belum ditambahkan."}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* TOMBOL SIMPAN (Hanya muncul saat Mode Edit) */}
                  {isEditing && (
                    <div className="mt-12 flex justify-end">
                      <button 
                        type="submit"
                        disabled={isSaving}
                        className="w-full md:w-auto bg-[#02253d] text-white px-12 py-5 font-black uppercase text-xl flex items-center justify-center gap-4 shadow-[8px_8px_0px_0px_rgba(194,178,163,1)] hover:bg-[#2f496e] active:translate-y-1 active:shadow-none disabled:opacity-50 transition-all"
                      >
                        {isSaving ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <><Save className="w-6 h-6" /> Simpan Perubahan</>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* --- TAB PESANAN SAYA (REAL DATABASE) --- */}
            {activeTab === 'pesanan' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                {orders.length === 0 ? (
                   <div className="p-12 text-center border-4 border-[#02253d] bg-white">
                     <Package className="w-16 h-16 text-[#94afc9] mx-auto mb-4" />
                     <h3 className="font-black text-2xl uppercase text-[#02253d]">Belum ada pesanan</h3>
                     <p className="font-medium text-[#2f496e]">Anda belum pernah melakukan transaksi.</p>
                   </div>
                ) : (
                  orders.map((order) => {
                    const statusStyle = getStatusStyle(order.status);
                    
                    // Merangkai nama barang dari order_items
                    const itemsString = order.order_items?.map((item: any) => `${item.quantity}x ${item.product_name}`).join(', ');

                    return (
                      <div key={order.id} className="border-4 border-[#02253d] bg-white shadow-[12px_12px_0px_0px_rgba(2,37,61,1)] overflow-hidden">
                        <div className="bg-[#f8f7f3] border-b-4 border-[#02253d] p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest mb-1">ID Pesanan</span>
                            <span className="text-2xl font-black text-[#02253d] uppercase">{order.id.slice(0, 8)}</span>
                            <span className="text-sm font-bold text-[#2f496e] mt-1">
                              {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-2 border-2 border-[#02253d] font-black uppercase text-xs ${statusStyle.bg} ${statusStyle.text} shadow-[4px_4px_0px_0px_rgba(2,37,61,1)]`}>
                            {statusStyle.icon} {order.status}
                          </div>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="flex-1">
                            <span className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest mb-2 block">Produk yang dibeli</span>
                            <p className="text-lg font-bold text-[#02253d] leading-relaxed">{itemsString}</p>
                          </div>
                          <div className="text-left md:text-right w-full md:w-auto border-t-4 md:border-t-0 border-[#02253d] pt-4 md:pt-0">
                            <span className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest mb-1 block">Total Belanja</span>
                            <span className="text-3xl font-black text-[#02253d] block mb-3">{formatRupiah(order.total_price)}</span>
                            
                            {/* BADGE STATUS PEMBAYARAN BARU */}
                            <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-[#02253d] shadow-[2px_2px_0px_0px_rgba(2,37,61,1)] ${order.payment_status === 'Sudah Dibayar' ? 'bg-green-400 text-[#02253d]' : order.payment_status === 'Gagal/Batal' ? 'bg-red-500 text-white' : 'bg-yellow-400 text-[#02253d]'}`}>
                              Status: {order.payment_status || 'Belum Dibayar'}
                            </span>
                          </div>
                        </div>
                        <div className="bg-[#02253d] p-4 flex justify-end gap-4">
                          {order.status !== "Selesai" && (
                            <button 
                              onClick={() => handleSelesaikanPesanan(order.id)}
                              className="bg-green-500 text-white px-6 py-2 border-2 border-transparent font-black uppercase text-xs hover:bg-green-600 transition-all flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" /> Selesaikan Pesanan
                            </button>
                          )}
                          <button className="bg-[#c2b2a3] text-[#02253d] px-6 py-2 border-2 border-[#02253d] font-black uppercase text-xs hover:bg-white transition-all">
                            Beli Lagi
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {/* Penjelasan Tambahan untuk Baris Kode */}
                {orders.length > 0 && (
                  <div className="p-8 border-4 border-dashed border-[#94afc9] text-center">
                    <p className="text-xs font-bold text-[#94afc9] uppercase tracking-widest italic">
                      -- Menampilkan riwayat transaksi secara urut berdasarkan tanggal pemesanan terbaru --
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}