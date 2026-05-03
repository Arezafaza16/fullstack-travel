import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PackagesSection from './components/PackagesSection';
import WhyUsSection from './components/WhyUsSection';
import PopularDestinations from './components/PopularDestinations';
import TestimonialsSection from './components/TestimonialsSection';
import ContactFormSection from './components/ContactFormSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <header>
        <Navbar />
      </header>
      <main>
        <HeroSection />
        <PackagesSection />
        <WhyUsSection />
        <PopularDestinations />
        <TestimonialsSection />
        <ContactFormSection />
      </main>
      <Footer />
    </div>
  );
}
