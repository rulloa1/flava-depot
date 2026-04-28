/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Instagram, 
  Twitter, 
  Facebook, 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Plus,
  ArrowRight
} from 'lucide-react';

/// --- Constants ---
const PRIMARY_COLOR = '#050505';
const GOLD_COLOR = '#C5A059';
const EMBER_COLOR = '#FF6B35';

// --- Icons ---
const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
    <path d="M12 22C12 22 11.5 18 10 16C8.5 14 6 13 6 13C8 13.5 10 13.5 11.5 12C11.5 12 9 10 7.5 10.5C6 11 4 12 4 12C5 11 7 9.5 9.5 8.5C11 8 13 8 13 8C11.5 7.5 9 5.5 8.5 4C8 2.5 8.5 1 8.5 1C9.5 2 11 4.5 11.5 6.5C10.5 5 10 3 11 2C12 3 12.5 5 13 6.5C13.5 4.5 15 2 16 1C16 1 16.5 2.5 16 4C15.5 5.5 13 7.5 11.5 8C11.5 8 13.5 8 15 8.5C17.5 9.5 19.5 11 20.5 12C20.5 12 18.5 11 17 10.5C15.5 10 13 12 13 12C14.5 13.5 16.5 13.5 18.5 13C18.5 13 16 14 14.5 16C13 18 12.5 22 12.5 22" />
  </svg>
);

// --- Components ---

/**
 * Atmospheric Smoke Canvas for background vibes
 */
const SmokeCanvas = ({ opacity = 0.5, density = 40 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 200 + 100;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.2 - 0.1;
        this.opacity = Math.random() * 0.04;
        // Using gold and ember for the smoke tint
        this.color = Math.random() > 0.8 ? EMBER_COLOR : GOLD_COLOR;
      }

      update(w: number, h: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < -200) this.x = w + 200;
        if (this.x > w + 200) this.x = -200;
        if (this.y < -200) this.y = h + 200;
        if (this.y > h + 200) this.y = -200;
      }

      draw(context: CanvasRenderingContext2D) {
        const gradient = context.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `${this.color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, 'transparent');
        
        context.globalCompositeOperation = 'screen';
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < density; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [density]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0" 
      style={{ opacity }}
    />
  );
};

// --- Main App Component ---

export default function App() {
  const [isAgeGated, setIsAgeGated] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  const handleEnter = () => {
    setIsAgeGated(false);
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  if (isAgeGated) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden font-display">
        <SmokeCanvas opacity={0.6} density={40} />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 text-center px-6"
        >
          <div className="flex justify-center mb-6 text-gold drop-shadow-[0_0_10px_rgba(197,160,89,0.3)]">
            <LeafIcon />
          </div>
          <h1 className="text-6xl md:text-9xl mb-2 tracking-tighter gold-gradient-text uppercase italic">
            <span className="font-script lowercase not-italic normal-case text-7xl md:text-[10rem]">Flava</span> Depot
          </h1>
          <p className="text-gray-500 tracking-[0.6em] text-[10px] md:text-xs mb-16 uppercase font-light">
            Premium Dispensary & Lounge
          </p>
          
          <div className="max-w-lg mx-auto bg-black/60 backdrop-blur-3xl border border-gold/10 p-12 rounded-[2rem] gold-glow">
            <h2 className="text-2xl mb-4 text-gold-light tracking-widest">ACCESS DENIED</h2>
            <p className="text-gray-400 text-sm mb-12 leading-relaxed tracking-wide uppercase">
              You must be of legal age to enter our digital lounge. <br/>
              By proceeding, you verify you are <span className="text-gold font-bold">21+</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={handleEnter}
                className="px-14 py-5 bg-gold hover:bg-gold-light text-black font-bold rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(197,160,89,0.4)] transform hover:scale-105 active:scale-95"
              >
                ENTER DEPOT
              </button>
              <button 
                onClick={handleExit}
                className="px-14 py-5 border border-gold/20 hover:bg-gold/10 text-gold-light font-medium rounded-full transition-all duration-500 transform hover:scale-105"
              >
                EXIT
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-gold selection:text-black bg-plum-black">
      <SmokeCanvas opacity={0.2} density={30} />
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-gold/10 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <h1 className="text-3xl font-display tracking-tighter gold-gradient-text italic flex items-center gap-3">
              <div className="text-gold scale-50"><LeafIcon /></div>
              <span className="font-script lowercase not-italic normal-case text-4xl">Flava</span> Depot
            </h1>
            <div className="hidden lg:flex gap-8 text-[11px] uppercase tracking-[0.3em] font-medium text-gray-500">
              <a href="#shop" className="hover:text-gold transition-colors">Products</a>
              <a href="#categories" className="hover:text-gold transition-colors">Collection</a>
              <a href="#locations" className="hover:text-gold transition-colors">Locations</a>
              <a href="#club" className="hover:text-gold transition-colors">Club</a>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <button className="text-gray-500 hover:text-gold transition-colors">
              <Search size={22} strokeWidth={1.5} />
            </button>
            <button className="relative text-gray-500 hover:text-gold transition-colors">
              <ShoppingBag size={22} strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 bg-gold text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">0</span>
            </button>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gold"
            >
              <Menu size={28} strokeWidth={1} />
            </button>
          </div>
        </div>
        
        {/* Status Strip */}
        <div className="w-full bg-gold/5 border-b border-gold/10 py-1">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[9px] font-display uppercase tracking-[0.4em] text-gold-dark">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse shadow-[0_0_5px_#C5A059]" />
              Now Open: Premium Service Available
            </div>
            <div className="hidden sm:block">Complimentary Valet at Mission Street</div>
            <div className="text-ember-orange font-bold">New Flower Drop Tomorrow</div>
          </div>
        </div>
      </nav>

      {/* --- Mobile Sidebar --- */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-[#050505] p-12 flex flex-col font-display"
          >
            <div className="flex justify-between items-center mb-20">
              <span className="text-lg tracking-widest text-gold italic">INDEX</span>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500">
                <X size={40} strokeWidth={0.5} />
              </button>
            </div>
            <div className="flex flex-col gap-10 text-5xl tracking-tighter uppercase italic">
              {['Products', 'Tinctures', 'Flower', 'Edibles', 'Lounges'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setSidebarOpen(false)}
                  className="hover:text-gold text-white/90 transition-all flex items-center justify-between group"
                >
                  <span className="group-hover:translate-x-4 transition-transform duration-500">{item}</span>
                  <ArrowRight size={32} className="opacity-0 group-hover:opacity-100 transition-all" strokeWidth={1} />
                </a>
              ))}
            </div>
            <div className="mt-auto border-t border-gold/10 pt-10 flex gap-10 text-gold-dark">
              <Instagram size={28} strokeWidth={1.5} />
              <Twitter size={28} strokeWidth={1.5} />
              <Facebook size={28} strokeWidth={1.5} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-plum-black via-[#050505]/40 to-black/80 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1571115177098-24ec42ed2bb4?q=80&w=2070&auto=format&fit=crop"
            alt="Vibe Background"
            className="w-full h-full object-cover filter brightness-[0.3] contrast-110 grayscale"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        <div className="relative z-20 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center mb-8 text-gold drop-shadow-xl"
          >
            <LeafIcon />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-7xl md:text-[10rem] font-display leading-[0.85] tracking-tighter mb-10 gold-gradient-text italic"
          >
            <span className="font-script lowercase not-italic normal-case text-9xl md:text-[14rem]">Flava</span> Depot<br/>
            <span className="text-white/95 not-italic tracking-normal text-4xl md:text-7xl">
              Premium Dispensary
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xs md:text-base text-gold-dark mb-16 max-w-xl mx-auto uppercase tracking-[0.5em] font-medium"
          >
            Sourced from trusted growers. Rigorously tested for purity.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-8 justify-center"
          >
            <button className="px-14 py-6 bg-gold text-black rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-gold-light hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(197,160,89,0.3)]">
              Discover Menu
            </button>
            <button className="px-14 py-6 border border-gold/30 gold-border rounded-full font-black text-xs uppercase tracking-[0.3em] text-gold-light hover:bg-gold/5 active:scale-95 transition-all">
              Locations
            </button>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-gold via-gold/20 to-transparent" />
        </motion.div>
      </header>

      {/* --- Featured Products --- */}
      <section id="shop" className="py-40 bg-[#020202]">
        <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
          <span className="text-gold text-[10px] uppercase tracking-[0.6em] mb-4 block font-black">Featured Selections</span>
          <h2 className="text-5xl md:text-8xl italic gold-gradient-text tracking-tighter">Premium Collection</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-6">
          {[
            { title: "Gelato 41", price: "$45", img: "https://images.unsplash.com/photo-1617193630783-a56594c4e61c?q=80&w=1000&auto=format&fit=crop", desc: "Hybrid • THC 24.7% • Euphoric", icon: "🍦" },
            { title: "Biscotti", price: "$50", img: "https://images.unsplash.com/photo-1603909793116-7911c53b64f6?q=80&w=1000&auto=format&fit=crop", desc: "Indica • THC 29.0% • Relaxing", icon: "🍪" },
            { title: "Sherb Bacio", price: "$42", img: "https://images.unsplash.com/photo-1627914436573-09756b1076f6?q=80&w=1000&auto=format&fit=crop", desc: "Indica • THC 25.0% • Calming", icon: "🍧" },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -15 }}
              className="group relative bg-[#050505] rounded-[2rem] border border-gold/5 p-6 shadow-2xl transition-all hover:border-gold/20"
            >
              <div className="aspect-square rounded-[1.5rem] overflow-hidden mb-8 relative">
                <img 
                  src={item.img} 
                  className="w-full h-full object-cover filter brightness-[0.8] group-hover:scale-110 group-hover:brightness-100 transition-all duration-1000" 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-lg border border-gold/20">
                  {item.icon}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-3xl italic mb-3 tracking-tighter text-white group-hover:text-gold transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-6 font-medium">{item.desc}</p>
                <div className="flex flex-col gap-4">
                   <span className="text-gold font-black text-xs tracking-[0.2em]">{item.price} — PREMIUM GRADE</span>
                   <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-gold hover:text-black transition-all">
                     View Details
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Budget Selections --- */}
      <section className="py-24 bg-[#050505] border-t border-gold/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-gold text-[10px] uppercase tracking-[0.6em] mb-4 block font-black">Daily Value Selection</span>
              <h2 className="text-4xl md:text-6xl italic gold-gradient-text tracking-tighter">Budget Picks</h2>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 border-l border-gold/20 pl-6 hidden md:block">
              Premium quality for exceptional value.<br/>Fresh, lab-tested cannabis flower.
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "King Louis OG", price: "$3", type: "Indica", note: "Sleepy • Relaxed" },
              { name: "Obama Runtz", price: "$5", type: "Hybrid", note: "Euphoric • Balanced" },
              { name: "Blue Nerds", price: "$5", type: "Hybrid", note: "Sweet • Relaxed" },
              { name: "Hard Candy", price: "$5", type: "Indica", note: "Focused • Energetic" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-2xl bg-black border border-white/5 hover:border-gold/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gold font-black text-2xl tracking-tighter">{item.price}</span>
                  <span className="text-[9px] uppercase tracking-widest bg-gold/10 text-gold px-2 py-1 rounded">PER GRAM</span>
                </div>
                <h4 className="text-white text-lg font-display italic mb-1">{item.name}</h4>
                <p className="text-gray-500 text-[9px] uppercase tracking-widest mb-4">{item.type}</p>
                <p className="text-white/40 text-[10px] font-medium">{item.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Specialized Categories --- */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-10 rounded-[3rem] bg-gradient-to-br from-gold/5 to-transparent border border-gold/10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl italic gold-gradient-text tracking-tighter">Artisan Edibles</h3>
              <span className="text-gold font-black text-xl">FROM $7</span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest leading-relaxed mb-8">
              Gourmet botanical infusions. Crafted with premium distillate and natural fruit terpenes.
            </p>
            <ul className="space-y-4 text-[10px] uppercase tracking-widest text-white/70 font-medium">
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Inolurks Fruit Chews</span> <span>$7 / EA</span></li>
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Botanical Gummies</span> <span>$15 / PK</span></li>
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Signature Brownies</span> <span>$12 / EA</span></li>
            </ul>
          </div>

          <div className="p-10 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent border border-white/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl italic text-white/90 tracking-tighter">Pure Concentrates</h3>
              <span className="text-white/40 font-black text-xl">$25 - $87</span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest leading-relaxed mb-8">
              Artisan extractions including Shatter, Sugar, Wax, and Diamonds. Lab-tested for maximum purity.
            </p>
            <ul className="space-y-4 text-[10px] uppercase tracking-widest text-white/70 font-medium">
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Artisan Shatter</span> <span>$25 / G</span></li>
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Live Resin Diamonds</span> <span>$87 / G</span></li>
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Gold Tier Budder</span> <span>$45 / G</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- Detailed Product Spotlight --- */}
      <section className="py-40 bg-black relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-gold/5 rounded-full blur-[100px] animate-pulse" />
            <img 
              src="https://images.unsplash.com/photo-1627914436573-09756b1076f6?q=80&w=1000&auto=format&fit=crop" 
              alt="Premium Selection" 
              className="relative z-10 w-full max-w-sm mx-auto drop-shadow-[0_45px_50px_rgba(0,0,0,0.9)] rounded-3xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold text-xs uppercase tracking-[0.5em] mb-6 block font-black border-b border-gold/20 pb-2 inline-block">Featured — Hybrid</span>
            <h2 className="text-5xl md:text-7xl italic gold-gradient-text mb-10 tracking-tighter">Gelato 41</h2>
            
            <p className="text-gray-400 text-sm mb-10 leading-relaxed uppercase tracking-widest font-light">
              A perfectly balanced hybrid known for its powerful euphoric effects and sweet, dessert-like flavor profile.
            </p>

            <div className="space-y-6 mb-12">
              {[
                { label: 'THC Level', value: '24.7% (High Potency)' },
                { label: 'CBD Level', value: '1.2% (Low)' },
                { label: 'Net Wt.', value: '3.5g (1/8 oz)' },
                { label: 'Grower', value: 'Flava Depot Small Batch' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500">{stat.label}</span>
                  <span className="text-sm font-medium text-white">{stat.value}</span>
                </div>
              ))}
            </div>
            
            <button className="w-full sm:w-auto px-12 py-5 bg-gradient-to-b from-gold-light to-gold-dark text-black font-black text-xs uppercase tracking-[0.3em] rounded-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
              <ShoppingBag size={18} strokeWidth={3} />
              ADD TO COLLECTION — $59
            </button>
          </motion.div>
        </div>
      </section>

      {/* --- Brand Ethics / About --- */}
      <section className="py-40 border-y border-gold/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <SmokeCanvas density={15} />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
           <div className="text-gold mb-10 scale-150 flex justify-center opacity-40"><LeafIcon /></div>
           <h2 className="text-4xl md:text-7xl tracking-tighter mb-12 italic gold-gradient-text uppercase">Tested. Trusted. Curated.</h2>
           <p className="text-gray-400 text-lg md:text-2xl font-light leading-relaxed mb-16">
             At Flava Depot, we dedicate ourselves to providing premium cannabis products that elevate your experience. Our flower is sourced from trusted local growers and rigorously lab-tested to ensure purity, potency, and consistency.
           </p>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-gold/10">
              {['Lab Tested', 'Purity First', 'Local Sourced', 'Gold Standard'].map(trait => (
                <div key={trait} className="flex flex-col items-center">
                  <div className="w-1 h-1 bg-gold rounded-full mb-4 shadow-gold shadow-glow" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-black text-gold-dark">{trait}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- Footer & Compliance --- */}
      <footer className="pt-40 pb-20 bg-black border-t border-gold/5 font-display">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 mb-40">
            <div>
              <h2 className="text-5xl italic gold-gradient-text mb-8 tracking-tighter">FLAVA DEPOT</h2>
              <div className="flex gap-8 text-gold-dark">
                <Instagram strokeWidth={1} />
                <Twitter strokeWidth={1} />
                <Facebook strokeWidth={1} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.4em] mb-10 text-gold font-black">Lounge Index</h4>
                <ul className="space-y-4 text-gray-500 text-xs uppercase tracking-widest font-medium">
                  {['Shop All', 'Flower', 'Edibles', 'Concentrates'].map(l => <li key={l} className="hover:text-gold transition-colors cursor-pointer">{l}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.4em] mb-10 text-gold font-black">Opening Hours</h4>
                <ul className="space-y-4 text-gray-500 text-xs uppercase tracking-widest font-medium">
                   <li>Mon - Sat: 10:00AM - 8:00PM</li>
                   <li>Sunday: 10:00AM - 5:00PM</li>
                </ul>
              </div>
            </div>
            
            <div className="border-l border-gold/10 pl-16">
              <h4 className="text-[10px] uppercase tracking-[0.4em] mb-10 text-gold font-black">Location</h4>
              <p className="text-gray-400 text-sm uppercase tracking-[0.2em] font-light mb-4 leading-relaxed">
                301 E. Tidwell Rd, Suite 307<br/>Houston, TX 77022
              </p>
              <p className="text-gold text-lg tracking-[0.2em] font-light">281-948-9917</p>
              <div className="mt-8 text-[8px] text-gray-600 uppercase tracking-widest leading-relaxed">
                Lincoln Blaccwood<br/>Cannabis Compliance Company
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-gold/5 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-[9px] uppercase tracking-[0.5em] text-gray-600">
              © 2024 FLAVA DEPOT PREMIER DISPENSARY
            </div>
            <div className="max-w-xl text-center md:text-right text-[8px] uppercase tracking-wider text-gray-700 italic leading-relaxed">
              WARNING: 21+ Only. Keep out of reach of children. Cannabis products may have intoxicating effects. Do not drive or operate machinery while using. For medical or recreational use only as permitted by local law.
            </div>
          </div>
        </div>
      </footer>

      {/* Progress Line */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gold z-[60] origin-left shadow-[0_0_10px_#C5A059]"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
