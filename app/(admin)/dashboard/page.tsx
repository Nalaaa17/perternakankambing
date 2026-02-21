"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Sesuaikan dengan folder 'lib' milikmu
import { Package, ShoppingCart, Users, TrendingUp, BarChart3, Activity } from "lucide-react";

export default function DashboardPage() {
  const supabase = createClient();
  
  // --- STATE DATA REAL ---
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    activeUsers: 0,
  });

  const [salesChart, setSalesChart] = useState<any[]>([]);
  const [userChart, setUserChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      setLoading(true);

      // 1. Ambil Total Pesanan
      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // 2. Hitung Total Pendapatan (Hanya yang statusnya 'Selesai')
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'Selesai');
      const totalRev = revenueData?.reduce((acc, curr) => acc + curr.total, 0) || 0;

      // 3. Ambil Total Produk
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // 4. Ambil Total Pelanggan
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalOrders: orderCount || 0,
        totalRevenue: totalRev,
        totalProducts: productCount || 0,
        activeUsers: userCount || 0,
      });

      // --- SIMULASI AGREGASI GRAFIK (Untuk Demo) ---
      // Idealnya ini menggunakan fungsi RPC di Supabase, tapi kita buat manual agar mudah dipahami
      setSalesChart([
        { month: "Jan", revenue: 45, items: 120 },
        { month: "Feb", revenue: 80, items: 210 },
        { month: "Mar", revenue: 65, items: 160 },
        { month: "Apr", revenue: 90, items: 250 },
        { month: "Mei", revenue: 120, items: 320 },
        { month: "Jun", revenue: 105, items: 280 },
      ]);

      setUserChart([
        { day: "Sen", users: 12 },
        { day: "Sel", users: 19 },
        { day: "Rab", users: 15 },
        { day: "Kam", users: 22 },
        { day: "Jum", users: 35 },
        { day: "Sab", users: 48 },
        { day: "Min", users: 40 },
      ]);

      setLoading(false);
    };

    getDashboardData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-2xl font-black uppercase text-[#02253d] animate-bounce">Memuat Data Peternakan...</div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* HEADER */}
      <header className="mb-12 border-b-4 border-[#02253d] pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-[#02253d] mb-2">Ringkasan</h1>
          <p className="text-[#2f496e] font-bold text-lg">Data aktual dari aktivitas peternakan hari ini.</p>
        </div>
        <div className="hidden md:block bg-[#02253d] text-white px-6 py-3 border-4 border-[#02253d] shadow-[6px_6px_0px_0px_rgba(194,178,163,1)] font-black uppercase">
          {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </header>

      {/* 1. WIDGET ANGKA PENTING (DIAMBIL DARI SUPABASE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        
        {/* Total Pesanan */}
        <div className="bg-white border-4 border-[#02253d] p-6 shadow-[8px_8px_0px_0px_rgba(2,37,61,1)] flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#02253d] text-white"><ShoppingCart className="w-8 h-8" /></div>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest mb-1">Total Pesanan</p>
            <p className="text-5xl font-black text-[#02253d]">{stats.totalOrders}</p>
          </div>
        </div>

        {/* Pendapatan */}
        <div className="bg-[#02253d] text-white border-4 border-[#02253d] p-6 shadow-[8px_8px_0px_0px_rgba(194,178,163,1)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white text-[#02253d]"><TrendingUp className="w-8 h-8" /></div>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest mb-1">Total Omzet</p>
            <p className="text-3xl font-black text-white truncate">
              Rp {(stats.totalRevenue / 1000000).toFixed(1)} JT
            </p>
          </div>
        </div>

        {/* Total Produk */}
        <div className="bg-white border-4 border-[#02253d] p-6 shadow-[8px_8px_0px_0px_rgba(2,37,61,1)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#c2b2a3] text-[#02253d] border-2 border-[#02253d]"><Package className="w-8 h-8" /></div>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest mb-1">Total Produk</p>
            <p className="text-5xl font-black text-[#02253d]">{stats.totalProducts}</p>
          </div>
        </div>

        {/* Pelanggan Aktif */}
        <div className="bg-white border-4 border-[#02253d] p-6 shadow-[8px_8px_0px_0px_rgba(2,37,61,1)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#f8f7f3] border-2 border-[#02253d] text-[#02253d]"><Users className="w-8 h-8" /></div>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#94afc9] uppercase tracking-widest mb-1">Pelanggan</p>
            <p className="text-5xl font-black text-[#02253d]">{stats.activeUsers}</p>
          </div>
        </div>
      </div>

      {/* AREA GRAFIK TETAP MENGGUNAKAN LOGIKA YANG SAMA TAPI DENGAN DATA DARI STATE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border-4 border-[#02253d] p-8 shadow-[12px_12px_0px_0px_rgba(2,37,61,1)]">
          <div className="flex justify-between items-center mb-8 border-b-4 border-[#02253d] pb-4">
            <h2 className="text-2xl font-black uppercase text-[#02253d]">Tren Penjualan</h2>
          </div>
          <div className="h-64 flex items-end gap-2 md:gap-8">
            {salesChart.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                <div className="w-full flex justify-center items-end gap-1 h-full">
                  <div className="w-full bg-[#02253d] border-4 border-[#02253d]" style={{ height: `${(data.revenue / 120) * 100}%` }}></div>
                </div>
                <span className="text-xs font-black uppercase text-[#02253d] mt-4">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#02253d] border-4 border-[#02253d] p-8 shadow-[12px_12px_0px_0px_rgba(194,178,163,1)] text-white">
          <h2 className="text-2xl font-black uppercase mb-8 border-b-4 border-[#2f496e] pb-4 text-white">Pendaftar Baru</h2>
          <div className="flex-1 flex flex-col gap-4">
            {userChart.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="w-8 text-xs font-black uppercase text-[#94afc9]">{data.day}</span>
                <div className="flex-1 h-6 bg-[#2f496e] relative">
                  <div className="absolute top-0 left-0 h-full bg-[#f8f7f3]" style={{ width: `${(data.users / 50) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}