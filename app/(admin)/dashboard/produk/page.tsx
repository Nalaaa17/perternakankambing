"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client"; // Import Client Real
import { addProduct, updateProduct, deleteProduct, updateStock } from "@/app/auth/actions"; // Import Actions Real
import { Plus, Edit, Trash2, Search, Minus, X, Save, Loader2 } from "lucide-react";

export default function KelolaProdukPage() {
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  
  // --- STATE DATA REAL ---
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State untuk Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // 1. AMBIL DATA REAL DARI DATABASE
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. LOGIKA PENCARIAN REAL-TIME
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. KURANGI/TAMBAH STOK CEPAT (DATABASE)
  const handleUpdateStock = async (id: string, currentStock: number, amount: number) => {
    const newStock = Math.max(0, currentStock + amount);
    // Update di database
    const res = await updateStock(id, newStock);
    if (res.success) {
      // Update di UI lokal agar cepat
      setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
    }
  };

  // 4. HAPUS PRODUK (DATABASE)
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${name}" dari katalog?`)) {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert("Gagal menghapus: " + res.error);
      }
    }
  };

  // 5. BUKA MODAL UNTUK EDIT
  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // 6. BUKA MODAL UNTUK TAMBAH BARU
  const openAddModal = () => {
    setEditingProduct({ 
      id: null, // null menandakan produk baru
      name: "", 
      price: 0, 
      stock: 1, 
      unit: "Kg", 
      category: "", 
      image_url: "/Foto/bg.jpeg",
      description: "" 
    });
    setIsModalOpen(true);
  };

  // 7. SIMPAN DATA KE DATABASE (TERMASUK FOTO)
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      let res;
      if (editingProduct?.id) {
        // Mode Edit: Kirim ID dan URL foto lama
        formData.append('productId', editingProduct.id);
        formData.append('currentImageUrl', editingProduct.image_url);
        res = await updateProduct(formData);
      } else {
        // Mode Tambah Baru
        res = await addProduct(formData);
      }

      if (res.success) {
        setIsModalOpen(false);
        fetchProducts(); // Refresh data terbaru
        alert("Berhasil menyimpan produk!");
      } else {
        alert("Terjadi kesalahan: " + res.error);
      }
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* HEADER (Tampilan Tetap) */}
      <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-4 border-[#02253d] pb-8">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-[#02253d] mb-2">Kelola Produk</h1>
          
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#02253d] text-[#f8f7f3] px-8 py-4 font-black uppercase text-lg flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_rgba(194,178,163,1)] hover:bg-[#2f496e] transition-all active:translate-y-1 active:shadow-none border-4 border-[#02253d]"
        >
          <Plus className="w-6 h-6" /> Tambah Produk
        </button>
      </header>

      {/* PENCARIAN (Sudah Berfungsi) */}
      <div className="mb-8 relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#02253d] w-6 h-6" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama produk di sini..." 
          className="w-full bg-white pl-16 pr-6 py-5 border-4 border-[#02253d] font-black text-lg text-[#02253d] placeholder:text-[#94afc9] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(2,37,61,1)] transition-all"
        />
      </div>

      {/* TABEL PRODUK (DATA DARI DATABASE) */}
      <div className="bg-white border-4 border-[#02253d] shadow-[12px_12px_0px_0px_rgba(2,37,61,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-[#02253d] text-white">
            <tr>
              <th className="p-6 font-black uppercase tracking-widest text-sm w-2/5">Info Produk</th>
              <th className="p-6 font-black uppercase tracking-widest text-sm text-center">Harga Jual</th>
              <th className="p-6 font-black uppercase tracking-widest text-sm text-center">Sisa Stok</th>
              <th className="p-6 font-black uppercase tracking-widest text-sm text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-12 text-center font-black uppercase">Memuat data ternak...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan={4} className="p-12 text-center font-black text-xl text-[#94afc9] uppercase">Produk tidak ditemukan.</td></tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="border-t-4 border-[#02253d] hover:bg-[#f8f7f3] transition-colors group">
                  <td className="p-6 flex items-center gap-6">
                    <div className="w-20 h-20 relative border-4 border-[#02253d] bg-[#c2b2a3] shrink-0 overflow-hidden">
                      <Image 
                        src={p.image_url || "/Foto/bg.jpeg"} 
                        alt={p.name} 
                        fill 
                        unoptimized // <--- TAMBAHKAN INI UNTUK MENGATASI PRIVATE IP ERROR
                        sizes="80px"
                        className="object-cover" 
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#02253d] uppercase tracking-tighter mb-1">{p.name}</h3>
                      <span className="text-[10px] font-black text-white bg-[#94afc9] px-3 py-1 uppercase tracking-widest border-2 border-[#02253d] inline-block mb-1">
                        {p.category}
                      </span>
                      <p className="text-xs font-bold text-[#2f496e] line-clamp-1 max-w-xs">{p.description}</p>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <p className="text-2xl font-black text-[#02253d]">Rp {p.price.toLocaleString("id-ID")}</p>
                    <p className="text-xs font-bold text-[#94afc9] uppercase">/ {p.unit}</p>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center border-4 border-[#02253d] bg-white">
                        <button onClick={() => handleUpdateStock(p.id, p.stock, -1)} className="p-2 hover:bg-[#c2b2a3] text-[#02253d] transition-colors border-r-4 border-[#02253d]"><Minus className="w-5 h-5 font-black" /></button>
                        <div className={`w-14 text-center font-black text-xl ${p.stock < 10 ? 'text-red-600' : 'text-[#02253d]'}`}>{p.stock}</div>
                        <button onClick={() => handleUpdateStock(p.id, p.stock, 1)} className="p-2 hover:bg-[#c2b2a3] text-[#02253d] transition-colors border-l-4 border-[#02253d]"><Plus className="w-5 h-5 font-black" /></button>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => openEditModal(p)} className="p-3 bg-blue-500 text-white border-4 border-[#02253d] hover:bg-blue-600 hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(2,37,61,1)] transition-all"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-3 bg-red-600 text-white border-4 border-[#02253d] hover:bg-red-700 hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(2,37,61,1)] transition-all"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL FORM DENGAN FITUR UPLOAD FOTO --- */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-[#02253d]/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-[#f8f7f3] w-full max-w-2xl border-8 border-[#02253d] shadow-[16px_16px_0px_0px_rgba(194,178,163,1)] animate-in zoom-in-95 duration-200 my-8">
            
            <div className="flex items-center justify-between p-6 border-b-4 border-[#02253d] bg-white sticky top-0 z-10">
              <h2 className="text-3xl font-black uppercase text-[#02253d] tracking-tighter">
                {editingProduct.id ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 border-4 border-transparent hover:border-[#02253d] hover:bg-red-500 hover:text-white transition-all text-[#02253d]">
                <X className="w-8 h-8 font-black" />
              </button>
            </div>

            <form onSubmit={handleSave} encType="multipart/form-data" className="p-8 space-y-6">
              
              {/* FITUR BARU: UPLOAD FOTO */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[#02253d] uppercase tracking-widest">Foto Produk</label>
                <div className="border-4 border-dashed border-[#02253d] p-4 bg-white">
                   <input 
                    type="file" 
                    name="image" 
                    accept="image/*"
                    className="w-full text-sm font-bold file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#02253d] file:text-white file:uppercase file:font-black cursor-pointer"
                   />
                   <p className="text-[10px] text-[#94afc9] mt-2 italic font-bold">Abaikan jika tidak ingin mengubah foto lama.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-[#02253d] uppercase tracking-widest">Nama Produk</label>
                  <input 
                    name="name" type="text" required
                    defaultValue={editingProduct.name}
                    className="w-full bg-white px-4 py-4 border-4 border-[#02253d] font-bold text-[#02253d] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(2,37,61,1)]"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-[#02253d] uppercase tracking-widest">Deskripsi Produk</label>
                  <textarea 
                    name="description" required rows={3}
                    defaultValue={editingProduct.description}
                    className="w-full bg-white px-4 py-4 border-4 border-[#02253d] font-bold text-[#02253d] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(2,37,61,1)] resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-[#02253d] uppercase tracking-widest">Kategori</label>
                  <select 
                    name="category" required 
                    defaultValue={editingProduct.category}
                    className="w-full bg-white px-4 py-4 border-4 border-[#02253d] font-bold text-[#02253d] focus:outline-none"
                  >
                    <option value="">Pilih Kategori...</option>
                    <option value="Daging Premium">Daging Premium</option>
                    <option value="Minuman Sehat">Minuman Sehat</option>
                    <option value="Bibit">Bibit (Hewan Hidup)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-[#02253d] uppercase tracking-widest">Harga Jual (Rp)</label>
                  <input 
                    name="price" type="number" required
                    defaultValue={editingProduct.price}
                    className="w-full bg-white px-4 py-4 border-4 border-[#02253d] font-bold text-[#02253d] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-[#02253d] uppercase tracking-widest">Stok Awal</label>
                  <input 
                    name="stock" type="number" required
                    defaultValue={editingProduct.stock}
                    className="w-full bg-white px-4 py-4 border-4 border-[#02253d] font-bold text-[#02253d] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-[#02253d] uppercase tracking-widest">Satuan Penjualan</label>
                  <select 
                    name="unit" required 
                    defaultValue={editingProduct.unit}
                    className="w-full bg-white px-4 py-4 border-4 border-[#02253d] font-bold text-[#02253d]"
                  >
                    <option value="Kg">Per Kilogram (Kg)</option>
                    <option value="Liter">Per Liter (L)</option>
                    <option value="Ekor">Per Ekor</option>
                    <option value="Pack">Per Pack</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t-4 border-[#02253d] flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 font-black uppercase border-4 border-[#02253d] text-[#02253d] hover:bg-[#c2b2a3] transition-colors">
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="px-8 py-4 font-black uppercase border-4 border-[#02253d] text-white bg-green-600 hover:bg-green-700 shadow-[6px_6px_0px_0px_rgba(2,37,61,1)] flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Simpan Produk
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}