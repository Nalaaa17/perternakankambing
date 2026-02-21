import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    // Tambahkan 'relative' di nav utama agar elemen tengah bisa diposisikan absolut
    <nav className="relative flex items-center justify-between p-6 md:px-12 border-b border-[#c2b2a3]/30">
      
      {/* BAGIAN KIRI: Logo & Judul */}
      <div className="flex items-center gap-4 z-10">
        <Image 
          src="/Foto/LogoPPKO26.jpeg" 
          alt="Logo Pojok Cerdas Agroindustri" 
          width={50} 
          height={50} 
          className="object-contain mix-blend-multiply"
        />
        <span className="font-extrabold text-xl tracking-tight uppercase">
          Pojok Cerdas <br /> Agroindustri
        </span>
      </div>
      
      {/* BAGIAN TENGAH: Menu Navigasi (Dipaksa persis di tengah layar) */}
      <div className="hidden md:flex gap-8 font-semibold text-sm absolute left-1/2 transform -translate-x-1/2">
        <Link href="/" className="hover:text-[#94afc9] transition-colors">Beranda</Link>
        <Link href="/katalog" className="hover:text-[#94afc9] transition-colors">Katalog</Link>
        <Link href="/tentang" className="hover:text-[#94afc9] transition-colors">Tentang Peternak</Link>
      </div>

      {/* BAGIAN KANAN: Tombol */}
      <div className="z-10">
        <button className="bg-[#02253d] text-[#f8f7f3] px-6 py-2 rounded-full font-bold text-sm hover:bg-[#2f496e] transition-colors">
          Masuk
        </button>
      </div>

    </nav>
  );
}