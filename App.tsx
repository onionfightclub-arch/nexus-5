
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { FloatingShapes } from './components/FloatingShapes.tsx';
import { AiStrategist } from './components/AiStrategist.tsx';
import { geminiService } from './services/geminiService.ts';
import { 
  Menu, 
  ChevronRight, 
  Instagram, 
  Twitter, 
  Linkedin, 
  ArrowUpRight,
  Zap,
  Layout,
  Globe,
  Star,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
  Target,
  Sparkles,
  ShieldCheck,
  Cpu,
  Maximize2,
  Wand2,
  Image as ImageIcon
} from 'lucide-react';
import { Service, PortfolioItem } from './types.ts';

const SERVICES: Service[] = [
  { id: '1', title: 'Brand Identity', description: 'Crafting unique visual stories that resonate with global audiences.', icon: 'Star' },
  { id: '2', title: 'Digital Strategy', description: 'Data-driven roadmaps to navigate the complex digital landscape.', icon: 'Zap' },
  { id: '3', title: 'Web Experience', description: 'Immersive 3D and interactive platforms built for high conversion.', icon: 'Globe' },
  { id: '4', title: 'UI/UX Design', description: 'Human-centric interfaces that blend aesthetics with seamless utility.', icon: 'Layout' },
];

const INITIAL_PORTFOLIO: PortfolioItem[] = [
  { 
    id: 1, 
    title: 'Luminal Tech', 
    category: 'Brand Strategy', 
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 2, 
    title: 'Aura Fashion', 
    category: 'E-Commerce', 
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 3, 
    title: 'Vertex Global', 
    category: 'Digital Campaign', 
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 4, 
    title: 'Solas Energy', 
    category: 'Interactive Design', 
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95282fc3656b?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 5, 
    title: 'Nexa Motors', 
    category: 'Product Launch', 
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 7, 
    title: 'Missing Concept', 
    category: 'AI Generated', 
    imageUrl: '' // Intentionally empty for AI feature demonstration
  },
];

const VALUES = [
  { icon: Target, title: "Mission-Driven", text: "We don't just build websites; we build ecosystems that empower brands to scale exponentially." },
  { icon: Sparkles, title: "Radical Creativity", text: "Boring is the enemy. We push boundaries to ensure your brand is seen and remembered." },
  { icon: ShieldCheck, title: "Trust & Transparency", text: "Solid partnerships are built on clarity. We integrate with your team as direct strategic allies." },
  { icon: Cpu, title: "Future-Proof Tech", text: "Utilizing AI and the latest interactive technologies to keep you ahead of the digital curve." }
];

interface FormData {
  name: string;
  email: string;
  interest: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    interest: 'branding',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter valid email';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is empty';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Min 10 chars';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormStatus('submitting');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFormStatus('success');
    setFormData({ name: '', email: '', interest: 'branding', message: '' });
  };

  const generateAIPortfolioImage = async (id: number, title: string) => {
    if (generatingId) return;
    setGeneratingId(id);
    const imageUrl = await geminiService.generateImage(title);
    if (imageUrl) {
      setPortfolioItems(prev => prev.map(item => item.id === id ? { ...item, imageUrl } : item));
    }
    setGeneratingId(null);
  };

  const getInputClasses = (fieldName: keyof FormErrors) => {
    const base = "w-full bg-white/5 border-b p-4 focus:outline-none focus:ring-4 transition-all duration-300 placeholder:text-white/10 text-sm md:text-base";
    const status = errors[fieldName] 
      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
      : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/10 focus:shadow-[0_8px_30px_rgb(79,70,229,0.1)]";
    return `${base} ${status}`;
  };

  useEffect(() => {
    if (isMenuOpen || selectedPortfolio) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen, selectedPortfolio]);

  // Animation variants for form stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] selection:bg-indigo-500 selection:text-white">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPortfolio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedPortfolio(null)}
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-6 right-6 z-[160] p-3 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
              onClick={() => setSelectedPortfolio(null)}
            >
              <X size={32} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-6xl w-full max-h-full flex flex-col md:flex-row gap-8 bg-[#0d0d0d] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 overflow-hidden bg-zinc-900 flex items-center justify-center">
                {selectedPortfolio.imageUrl ? (
                  <img 
                    src={selectedPortfolio.imageUrl} 
                    alt={selectedPortfolio.title} 
                    className="w-full h-full object-cover max-h-[50vh] md:max-h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center text-white/20 gap-4">
                    <ImageIcon size={64} />
                    <span className="uppercase tracking-[0.2em] font-black text-xs">No Visual Content</span>
                  </div>
                )}
              </div>
              <div className="w-full md:w-[350px] p-8 md:p-12 flex flex-col justify-center">
                <span className="text-indigo-500 font-bold tracking-[0.3em] uppercase text-xs mb-4">
                  {selectedPortfolio.category}
                </span>
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-6 uppercase">
                  {selectedPortfolio.title}
                </h3>
                <p className="text-white/60 leading-relaxed mb-8">
                  A comprehensive showcase of strategic execution and artistic vision, designed to bridge the gap between human experience and digital performance.
                </p>
                <div className="flex flex-col gap-4">
                  {!selectedPortfolio.imageUrl && (
                    <button 
                      onClick={() => generateAIPortfolioImage(selectedPortfolio.id, selectedPortfolio.title)}
                      disabled={generatingId === selectedPortfolio.id}
                      className="flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-full font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                    >
                      {generatingId === selectedPortfolio.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Wand2 size={18} />
                      )}
                      {generatingId === selectedPortfolio.id ? 'GENERATING...' : 'GENERATE AI CONCEPT'}
                    </button>
                  )}
                  <button className="flex items-center justify-center gap-2 bg-white text-black py-4 rounded-full font-bold hover:bg-indigo-500 hover:text-white transition-all group">
                    View Live Project
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed top-0 w-full z-50 p-6 md:p-8 flex justify-between items-center mix-blend-difference">
        <a href="#" className="text-2xl font-black tracking-tighter hover:scale-105 transition-transform text-white">
          NEXUS<span className="text-indigo-500">.</span>
        </a>
        <div className="hidden md:flex gap-12 text-sm font-semibold uppercase tracking-widest items-center">
          <a href="#services" className="hover:text-indigo-500 transition-colors text-white">Services</a>
          <a href="#work" className="hover:text-indigo-500 transition-colors text-white">Work</a>
          <a href="#about" className="hover:text-indigo-500 transition-colors text-white">About</a>
          <a href="#contact" className="px-6 py-2 bg-white text-black rounded-full hover:bg-indigo-500 hover:text-white transition-all">Start Project</a>
        </div>
        <button 
          onClick={() => setIsMenuOpen(true)} 
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Open Menu"
        >
          <Menu size={28} />
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-[#0a0a0a] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-2xl font-black tracking-tighter">NEXUS<span className="text-indigo-500">.</span></span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close Menu"
              >
                <X size={32} />
              </button>
            </div>
            
            <div className="flex flex-col gap-8 text-4xl font-black tracking-tighter uppercase italic font-serif text-white">
              <motion.a href="#services" onClick={() => setIsMenuOpen(false)} className="hover:text-indigo-500 transition-colors">Services</motion.a>
              <motion.a href="#work" onClick={() => setIsMenuOpen(false)} className="hover:text-indigo-500 transition-colors">Work</motion.a>
              <motion.a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-indigo-500 transition-colors">About</motion.a>
              <motion.a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-indigo-500">Contact</motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
        <FloatingShapes />
        <div className="relative z-10 text-center max-w-5xl space-y-6 md:space-y-8 mt-12 md:mt-0">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] md:leading-[0.8]">
              DEFINING THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 italic font-serif">DIGITAL</span> NARRATIVE
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-white/60 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium px-4">
            We blend avant-garde design with strategic intelligence to craft immersive brands that dominate the future market.
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a href="#work" className="w-full sm:w-auto group bg-white text-black px-10 py-5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 hover:text-white transition-all">
              VIEW OUR WORK
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button className="w-full sm:w-auto text-white border border-white/20 px-10 py-5 rounded-full font-bold hover:bg-white/10 transition-all">OUR STUDIO</button>
          </motion.div>
        </div>
      </header>

      <section id="services" className="py-20 md:py-40 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 gap-6 md:gap-8">
          <div className="space-y-4">
            <span className="text-indigo-500 uppercase tracking-widest font-black text-xs md:text-sm">Elevate Your Presence</span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight">CRAFTED SOLUTIONS.</h2>
          </div>
          <p className="max-w-md text-white/50 text-left lg:text-right italic font-serif text-base md:text-lg">"Design is the silent ambassador of your brand."</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {SERVICES.map((service, index) => (
            <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="group p-6 md:p-8 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl hover:bg-indigo-600/10 hover:border-indigo-500/50 transition-all duration-500 cursor-pointer">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                {service.icon === 'Zap' && <Zap size={20} />}
                {service.icon === 'Globe' && <Globe size={20} />}
                {service.icon === 'Layout' && <Layout size={20} />}
                {service.icon === 'Star' && <Star size={20} />}
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{service.title}</h3>
              <p className="text-white/50 text-xs md:text-sm leading-relaxed mb-6 group-hover:text-white/80 transition-colors">{service.description}</p>
              <ArrowUpRight size={18} className="text-white/20 group-hover:text-indigo-500 transition-colors" />
            </motion.div>
          ))}
        </div>
      </section>

      <section id="work" className="bg-white text-black py-20 md:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter">FEATURED WORK</h2>
              <p className="text-lg md:text-xl font-medium text-black/40">Selected projects that redefined boundaries.</p>
            </div>
            <div className="flex gap-4">
               <button 
                 onClick={() => {
                   const missing = portfolioItems.filter(item => !item.imageUrl);
                   if (missing.length > 0) {
                     generateAIPortfolioImage(missing[0].id, missing[0].title);
                   }
                 }}
                 disabled={!!generatingId || !portfolioItems.some(i => !i.imageUrl)}
                 className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase bg-black text-white px-6 py-4 rounded-full hover:bg-indigo-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
               >
                 {generatingId ? (
                   <Loader2 size={14} className="animate-spin text-indigo-400" />
                 ) : (
                   <Wand2 size={14} className="group-hover:rotate-12 transition-transform" />
                 )}
                 {generatingId ? 'AI Processing...' : 'Auto-Generate Visuals'}
               </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {portfolioItems.map((item, index) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }} 
                transition={{ duration: 0.6, delay: index * 0.1 }} 
                whileHover={{ y: -10 }} 
                className="group cursor-pointer"
                onClick={() => setSelectedPortfolio(item)}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl mb-4 bg-zinc-900 border border-zinc-200/10 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      loading="lazy" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-in-out" 
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-white/10 group-hover:text-indigo-500/40 transition-colors">
                      {generatingId === item.id ? (
                        <div className="relative">
                          <Loader2 size={48} className="animate-spin text-indigo-500" />
                          <div className="absolute inset-0 animate-ping bg-indigo-500/20 rounded-full"></div>
                        </div>
                      ) : (
                        <ImageIcon size={48} />
                      )}
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {generatingId === item.id ? 'Crafting Image...' : 'Visual pending'}
                      </span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center flex-col gap-3">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-xl">
                      {item.imageUrl ? <Maximize2 className="text-black" /> : <Wand2 className="text-black" />}
                    </div>
                    <span className="text-white text-xs font-black tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      {item.imageUrl ? 'View Gallery' : 'Generate Concept'}
                    </span>
                  </div>

                  {generatingId === item.id && (
                    <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 transition-all duration-500">
                       <div className="relative">
                         <Loader2 size={40} className="animate-spin text-indigo-500" />
                         <div className="absolute inset-0 animate-ping opacity-20 bg-indigo-500 rounded-full"></div>
                       </div>
                       <div className="flex flex-col items-center gap-1">
                         <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase animate-pulse">Generating</span>
                         <span className="text-[8px] font-bold text-indigo-400/80 tracking-widest uppercase">Nexus AI Engine</span>
                       </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start px-2">
                  <div className="space-y-1">
                    <h4 className="text-lg md:text-xl font-black uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                    <p className="text-black/40 text-xs md:text-sm font-bold tracking-[0.2em] uppercase">{item.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 md:py-48 px-6 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="space-y-8">
              <div className="space-y-4">
                <span className="text-indigo-500 uppercase tracking-[0.3em] font-black text-xs">Architects of Experience</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">BEYOND THE <br /><span className="text-indigo-500 italic font-serif">PIXELS</span>.</h2>
              </div>
              <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-xl font-light">
                Nexus Creative is a boutique agency focused on bridging the gap between artistic expression and commercial performance. We specialize in digital-first storytelling.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                {VALUES.map((v, i) => (
                  <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="space-y-3">
                    <div className="flex items-center gap-3 text-white">
                      <v.icon className="text-indigo-500" size={24} />
                      <h4 className="font-bold text-lg">{v.title}</h4>
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed">{v.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8, rotate: 5 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, ease: "easeOut" }} viewport={{ once: true }} className="relative group">
              <div className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" alt="Nexus Team" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 md:py-40 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">LET'S BUILD <br /><span className="text-indigo-500 italic font-serif">MAGIC</span> TOGETHER.</h2>
            <div className="space-y-4 pt-4">
              <p className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-white/30">Email us</p>
              <a href="mailto:hello@nexus.creative" className="text-xl sm:text-2xl md:text-3xl font-bold hover:text-indigo-500 transition-colors break-all">hello@nexus.creative</a>
            </div>
            <div className="flex gap-4 md:gap-6 pt-4">
              <a href="#" className="p-3 md:p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="p-3 md:p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="p-3 md:p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Linkedin size={20} /></a>
            </div>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              {formStatus === 'success' ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center p-8 bg-white/5 rounded-3xl border border-indigo-500/30">
                  <CheckCircle2 size={64} className="text-indigo-500 mb-6" />
                  <h3 className="text-2xl font-bold mb-2">MESSAGE RECEIVED</h3>
                  <button onClick={() => setFormStatus('idle')} className="text-indigo-400 text-sm font-bold mt-4 underline underline-offset-4">SEND ANOTHER</button>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <input name="name" value={formData.name} onChange={handleInputChange} className={getInputClasses('name')} placeholder="Name" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <input name="email" value={formData.email} onChange={handleInputChange} className={getInputClasses('email')} placeholder="Email" />
                    </motion.div>
                  </div>
                  <motion.div variants={itemVariants}>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} rows={4} className={getInputClasses('message')} placeholder="Project details" />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <button disabled={formStatus === 'submitting'} className="w-full bg-indigo-600 py-6 rounded-2xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
                      {formStatus === 'submitting' ? <Loader2 className="animate-spin" /> : (
                        <>
                          SEND INQUIRY
                          <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </motion.div>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 px-6 text-center">
        <p className="text-white/30 text-xs md:text-sm">&copy; {new Date().getFullYear()} NEXUS CREATIVE AGENCY. ALL RIGHTS RESERVED.</p>
      </footer>
      <AiStrategist />
    </div>
  );
};

export default App;
