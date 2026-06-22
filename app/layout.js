import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import CartDrawer from './components/layout/CartDrawer';
import Footer from './components/layout/Footer';

// We import Google Fonts via globals.css @import for Playfair Display + Nunito Sans
// Inter is used as a fallback only
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Tienda Luxa — Perfumería y Cosmética de Lujo en Paraguay',
  description:
    'Descubrí los mejores perfumes, cosméticos y accesorios de lujo del mundo. Chanel, Dior, Tom Ford, La Mer y más. Envíos en todo Paraguay. Pagá por transferencia SIPAP o efectivo.',
  keywords: 'perfumes lujo paraguay, cosméticos lujo asunción, chanel paraguay, dior paraguay, tienda perfumería',
  openGraph: {
    title: 'Tienda Luxa — Perfumería y Cosmética de Lujo',
    description: 'Los mejores perfumes y cosméticos de lujo del mundo, en Paraguay.',
    locale: 'es_PY',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-PY">
      <body className={inter.variable}>
        <CartProvider>
          <Header />
          <CartDrawer />
          <main style={{ paddingTop: 'var(--header-height)' }}>
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
