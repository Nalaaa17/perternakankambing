import Navbar from "@/components/AppNavbar";
import Footer from "@/components/AppFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#02253d] flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}