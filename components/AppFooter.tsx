import Link from "next/link";
// Import ikon dari lucide-react untuk mempercantik informasi kontak
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#02253d] text-[#f8f7f3] pt-20 flex flex-col overflow-hidden">
      
      {/* 1. KONTEN UTAMA FOOTER (Grid 4 Kolom) */}
      <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Kolom 1: Brand & Deskripsi */}
        <div className="flex flex-col">
          <h3 className="font-extrabold text-2xl tracking-tight uppercase mb-6 text-[#f8f7f3]">
            Pojok Cerdas <br /> <span className="text-[#94afc9]">Agroindustri</span>
          </h3>
          <p className="text-[#94afc9] leading-relaxed mb-6 pr-4">
            Memberdayakan peternak lokal melalui digitalisasi pemasaran. Menghadirkan produk peternakan berkualitas langsung ke meja Anda.
          </p>
          {/* Ikon Media Sosial */}
          <div className="flex gap-4">
            <a href="#" className="bg-[#2f496e] p-2 rounded-full hover:bg-[#c2b2a3] hover:text-[#02253d] transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="bg-[#2f496e] p-2 rounded-full hover:bg-[#c2b2a3] hover:text-[#02253d] transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="bg-[#2f496e] p-2 rounded-full hover:bg-[#c2b2a3] hover:text-[#02253d] transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Kolom 2: Navigasi Cepat */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-[#f8f7f3]">Perusahaan</h4>
          <ul className="space-y-4 text-[#94afc9]">
            <li><Link href="/" className="hover:text-[#c2b2a3] transition-colors">Beranda</Link></li>
            <li><Link href="/tentang" className="hover:text-[#c2b2a3] transition-colors">Tentang Peternak</Link></li>
            <li><Link href="/katalog" className="hover:text-[#c2b2a3] transition-colors">Katalog Produk</Link></li>
            <li><Link href="/blog" className="hover:text-[#c2b2a3] transition-colors">Artikel & Edukasi</Link></li>
          </ul>
        </div>

        {/* Kolom 3: Layanan Pelanggan */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-[#f8f7f3]">Bantuan</h4>
          <ul className="space-y-4 text-[#94afc9]">
            <li><Link href="/cara-pesan" className="hover:text-[#c2b2a3] transition-colors">Cara Pemesanan</Link></li>
            <li><Link href="/pengiriman" className="hover:text-[#c2b2a3] transition-colors">Informasi Pengiriman</Link></li>
            <li><Link href="/faq" className="hover:text-[#c2b2a3] transition-colors">Tanya Jawab (FAQ)</Link></li>
            <li><Link href="/admin" className="hover:text-[#c2b2a3] transition-colors">Login Admin</Link></li>
          </ul>
        </div>

        {/* Kolom 4: Kontak Info */}
        <div>
          <h4 className="font-bold text-lg mb-6 text-[#f8f7f3]">Hubungi Kami</h4>
          <ul className="space-y-4 text-[#94afc9]">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-1 shrink-0 text-[#c2b2a3]" />
              <span>Jl. Peternakan Makmur No. 12, Desa Harapan, Jawa Timur 68111</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 shrink-0 text-[#c2b2a3]" />
              <span>+62 812-3456-7890</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 shrink-0 text-[#c2b2a3]" />
              <span>halo@agroindustri.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* 2. TEKS RAKSASA (Ciri khas desain brutalism) */}
      <div className="px-6 md:px-12 w-full select-none pointer-events-none mb-8">
        <h2 className="text-[14vw] md:text-[12vw] font-black leading-none tracking-tighter text-[#2f496e] text-center">
          AGROINDUSTRI.
        </h2>
      </div>

      {/* 3. BARIS COPYRIGHT */}
      <div className="border-t border-[#2f496e] py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#94afc9]">
        <p>© 2026 Pojok Cerdas Agroindustri. Hak Cipta Dilindungi.</p>
        <div className="flex gap-6">
          <Link href="/privasi" className="hover:text-[#c2b2a3] transition-colors">Kebijakan Privasi</Link>
          <Link href="/syarat" className="hover:text-[#c2b2a3] transition-colors">Syarat & Ketentuan</Link>
        </div>
      </div>

    </footer>
  );
}   