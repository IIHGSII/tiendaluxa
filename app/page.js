import HeroSection from './components/home/HeroSection';
import CategoryGrid from './components/home/CategoryGrid';
import BestSellers from './components/home/BestSellers';
import VideoFeed from './components/home/VideoFeed';

export const metadata = {
  title: 'Tienda Luxa — Perfumería y Cosmética de Lujo en Paraguay',
  description:
    'Descubrí perfumes, cosméticos y accesorios de lujo: Chanel, Dior, Tom Ford, La Mer y más. Envíos en todo Paraguay. Pagá por SIPAP o efectivo.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <BestSellers />
      <VideoFeed />
    </>
  );
}
