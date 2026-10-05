import Navbar from "@/components/pages/(public)/demo/Navbar";
import Footer from "@/components/pages/(public)/demo/Footer";
import PageTransition from "@/components/common/dashboard/PageTransition";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}