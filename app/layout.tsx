
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Aroepa Uitzendbureau",
  description: "Vacatures zoeken en direct solliciteren."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <header className="border-b border-gray-200">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg">Aroepa Uitzendbureau</Link>
            <nav className="flex items-center gap-4">
              <Link href="/vacatures">Vacatures</Link>
              <Link href="/over">Over</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="border-t border-gray-200 mt-16">
          <div className="container py-6 text-sm text-gray-600">
            © {new Date().getFullYear()} Aroepa Uitzendbureau B.V.
          </div>
        </footer>
      </body>
    </html>
  );
}
