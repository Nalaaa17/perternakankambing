"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client"; // Import Client Real
import { updateOrderStatus } from "@/app/auth/actions"; // Import Action Real
import { 
  Search, Clock, Package, Truck, CheckCircle2, 
  MapPin, Phone, User, Store, Loader2 
} from "lucide-react";

export default function PesananMasukPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. FETCH DATA REAL DARI DATABASE
  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. HANDLER UBAH STATUS (DATABASE)
  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateOrderStatus(id, newStatus);
    if (res.success) {
      fetchOrders(); // Refresh data setelah update
    } else {
      alert("Gagal update status: " + res.error);
    }
  };

  // 3. BADGE STATUS (Disesuaikan menjadi 3 Alur)
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Menunggu": 
        return <span className="bg-yellow-400 text-[#02253d] px-4 py-2 border-4 border-[#02253d] font-black uppercase text-xs flex items-center gap-2 w-max shadow-[4px_4px_0px_0px_rgba(2,37,61,1)]"><Clock className="w-4 h-4"/> Menunggu</span>;
      case "Diverifikasi": 
        return <span className="bg-blue-500 text-white px-4 py-2 border-4 border-[#02253d] font-black uppercase text-xs flex items-center gap-2 w-max shadow-[4px_4px_0px_0px_rgba(2,37,61,1)]"><Package className="w-4 h-4"/> Diverifikasi</span>;
      case "Selesai": 
        return <span className="bg-green-500 text-white px-4 py-2 border-4 border-[#02253d] font-black uppercase text-xs flex items-center gap-2 w-max shadow-[4px_4px_0px_0px_rgba(2,37,61,1)]"><CheckCircle2 className="w-4 h-4"/> Selesai</span>;
      default: 
        return <span className="bg-gray-200 px-4 py-2 border-4 border-[#02253d] font-black uppercase text-xs">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_phone.includes(searchTerm)
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* HEADER STATISTIK */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-[#02253d] pb-8">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-[#02253d] mb-2">Pesanan Masuk</h1>
          <p className="text-[#2f496e] font-bold text-lg">Pantau pesanan, siapkan barang, dan atur pengiriman.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#02253d] text-white px-6 py-3 border-4 border-[#02253d] shadow-[6px_6px_0px_0px_rgba(194,178,163,1)] font-black uppercase text-center">
            <span className="block text-3xl">{orders.filter(o => o.status === "Menunggu").length}</span>
            <span className="text-[10px] tracking-widest">Menunggu</span>
          </div>
          <div className="bg-[#f8f7f3] text-[#02253d] px-6 py-3 border-4 border-[#02253d] shadow-[6px_6px_0px_0px_rgba(194,178,163,1)] font-black uppercase text-center">
            <span className="block text-3xl">{orders.filter(o => o.status === "Diverifikasi").length}</span>
            <span className="text-[10px] tracking-widest">Aktif</span>
          </div>
        </div>
      </header>

      {/* PENCARIAN */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#02253d] w-6 h-6" />
          <input 
            type="text" 
            placeholder="Cari ID Pesanan, Nama, atau No HP..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white pl-16 pr-6 py-4 border-4 border-[#02253d] font-black text-[#02253d] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(2,37,61,1)] transition-all"
          />
        </div>
      </div>

      {/* TABEL PESANAN REAL */}
      <div className="bg-white border-4 border-[#02253d] shadow-[12px_12px_0px_0px_rgba(2,37,61,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-[#02253d] text-white">
            <tr>
              <th className="p-6 font-black uppercase tracking-widest text-sm w-1/5">ID & Tanggal</th>
              <th className="p-6 font-black uppercase tracking-widest text-sm w-2/5">Info Pesanan & Pengiriman</th>
              <th className="p-6 font-black uppercase tracking-widest text-sm text-center">Total Bayar</th>
              <th className="p-6 font-black uppercase tracking-widest text-sm text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-12 text-center font-black uppercase tracking-widest">Memproses Pesanan...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={4} className="p-12 text-center font-black text-xl text-[#94afc9] uppercase">Tidak ada pesanan.</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-t-4 border-[#02253d] hover:bg-[#f8f7f3] transition-colors">
                  
                  {/* Kolom ID & Tanggal */}
                  <td className="p-6 align-top">
                    <p className="text-2xl font-black text-[#02253d] uppercase tracking-tighter mb-1">{order.id.slice(0, 8)}</p>
                    <p className="text-sm font-bold text-[#94afc9] uppercase tracking-widest">
                      {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {/* METODE PENGIRIMAN */}
                    <div className="mt-4 flex items-center gap-2 bg-[#f8f7f3] border-2 border-[#02253d] px-3 py-1 w-max">
                      {order.delivery_method === 'Antar ke Rumah' ? <Truck className="w-3 h-3"/> : <Store className="w-3 h-3"/>}
                      <span className="text-[10px] font-black uppercase">{order.delivery_method}</span>
                    </div>
                  </td>

                  {/* Kolom Info Lengkap */}
                  <td className="p-6 align-top space-y-4">
                    <div>
                      <p className="text-xl font-black text-[#02253d] uppercase flex items-center gap-2 mb-1">
                        <User className="w-4 h-4"/> {order.customer_name}
                      </p>
                      <p className="text-sm font-bold text-[#2f496e] flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {order.customer_phone}
                      </p>
                    </div>

                    {/* Barang dari Database */}
                    <div className="bg-white border-4 border-[#02253d] p-4 shadow-[4px_4px_0px_0px_rgba(194,178,163,1)]">
                      <span className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest block mb-2">Barang yang harus disiapkan:</span>
                      {order.order_items?.map((item: any, idx: number) => (
                        <p key={idx} className="text-base font-bold text-[#02253d] leading-relaxed uppercase">
                          {item.quantity}x {item.product_name}
                        </p>
                      ))}
                    </div>

                    {/* Alamat Bersyarat (Hanya muncul jika Antar ke Rumah) */}
                    {order.delivery_method === 'Antar ke Rumah' && (
                      <div className="bg-[#02253d] text-white border-4 border-[#02253d] p-4 shadow-[4px_4px_0px_0px_rgba(194,178,163,1)]">
                        <span className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4" /> Alamat Tujuan Pengiriman:
                        </span>
                        <p className="text-sm font-medium leading-relaxed text-[#f8f7f3]">{order.delivery_address}</p>
                      </div>
                    )}
                  </td>

                  {/* Kolom Total & Status Pembayaran */}
                  <td className="p-6 align-top text-center">
                    <p className="text-3xl font-black text-[#02253d] mt-2">
                      Rp {order.total_price.toLocaleString("id-ID")}
                    </p>
                    
                    {/* BADGE STATUS PEMBAYARAN BARU */}
                    <div className={`mt-4 inline-block px-3 py-1 text-xs font-black uppercase tracking-widest border-2 border-[#02253d] shadow-[2px_2px_0px_0px_rgba(2,37,61,1)] ${order.payment_status === 'Sudah Dibayar' ? 'bg-green-400 text-[#02253d]' : order.payment_status === 'Gagal/Batal' ? 'bg-red-500 text-white' : 'bg-yellow-400 text-[#02253d]'}`}>
                      {order.payment_status || 'Belum Dibayar'}
                    </div>
                  </td>

                  {/* Kolom Status */}
                  <td className="p-6 align-top">
                    <div className="flex flex-col items-center gap-6 mt-2">
                      {getStatusBadge(order.status)}
                      <div className="w-full max-w-[160px]">
                        <span className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest block mb-1 text-center">Ubah Status:</span>
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="w-full bg-white border-4 border-[#02253d] p-3 font-black text-sm uppercase text-[#02253d] focus:outline-none cursor-pointer hover:bg-[#c2b2a3] transition-colors text-center"
                        >
                          <option value="Menunggu">Menunggu</option>
                          <option value="Diverifikasi">Diverifikasi</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </div>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}