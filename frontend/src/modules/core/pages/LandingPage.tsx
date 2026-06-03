import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, ArrowRight, BrainCircuit, Users, Scan, Map, Database,
  Cpu, Lock, BarChart3, Building2, Layers,
  Terminal, CheckCircle2, ChevronDown, RefreshCw, Radio,
  Fingerprint, Check, Briefcase, FileSpreadsheet, Server, UserCheck,
  AlertCircle, Menu, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '@/config/api';
import { useTheme } from '@/components/ThemeContext';

export default function LandingPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Onboarding Form States
  const [requestForm, setRequestForm] = useState({
    organizationName: '',
    organizationType: 'Corporation',
    industry: 'Mining',
    organizationSize: '1-50',
    country: 'United States',
    address: '',
    officialWebsite: '',
    contactName: '',
    contactDesignation: '',
    officialEmail: '',
    phone: '',
    requestedServices: [] as string[],
    expectedUsers: 10,
    branchCount: 1,
    deploymentType: 'Cloud',
    additionalNotes: ''
  });
  const [reqSubmitted, setReqSubmitted] = useState(false);
  const [orgRegLoading, setOrgRegLoading] = useState(false);
  const [orgRegError, setOrgRegError] = useState<string | null>(null);

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgRegError(null);
    setOrgRegLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/request-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestForm)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.detail || 'Access request submission failed');
      }

      setReqSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setOrgRegError(err.message || 'Access request submission failed');
    } finally {
      setOrgRegLoading(false);
    }
  };

  // Active Simulated Operators & Personnel
  const personnelList = [
    'arjun', 'godfrey'
  ];

  const coreTeam = [
    {
      name: 'Arjun S N',
      role: t('System Architect / Team Leader'),
      description: t('Visionary engineer building decentralized identity protocols and zero-trust synchronization logic for distributed edge networks.'),
      avatar: '⚙️',
      specialty: t('Rust / Go / Distributed Systems')
    },
    {
      name: 'Godfrey T R',
      role: t('System Developer / Team Member'),
      description: t('Driving product strategy and industrial deployment, ensuring seamless integration of EdgeAI into critical infrastructure workflows.'),
      avatar: '🎨',
      specialty: t('Product Design / Industrial IoT / Strategy')
    }
  ];

  // Interactive Mouse Tail Parallax Coordinate States
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, rawX: 0, rawY: 0 });

  // Mobile Biometric Fingerprint Scanner Simulation States
  const [fingerprintState, setFingerprintState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [fingerprintProgress, setFingerprintProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState(t('TOUCH & HOLD SCANNER'));
  const scanIntervalRef = useRef<any>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // Parallax translation vector offset
      const x = (clientX / innerWidth - 0.5) * 80;
      const y = (clientY / innerHeight - 0.5) * 80;
      setMousePos({ x, y, rawX: clientX + window.scrollX, rawY: clientY + window.scrollY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const startFingerprintScan = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (fingerprintState === 'success') return;

    if ('vibrate' in navigator) {
      navigator.vibrate([50]);
    }

    setFingerprintState('scanning');
    setFingerprintProgress(0);
    setScanMessage(t('ACQUIRING BIOMETRIC KEY...'));

    const randomOp = personnelList.at(Math.floor(Math.random() * personnelList.length)) || personnelList.at(0) || 'OPERATOR';

    let progress = 0;
    scanIntervalRef.current = setInterval(() => {
      progress += 4;
      if (progress >= 100) {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        setFingerprintProgress(100);
        setFingerprintState('success');
        setScanMessage(t(`ACCESS GRANTED // OP: {{op}}`, { op: randomOp.toUpperCase() }));
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setFingerprintProgress(progress);
        if (progress === 36) setScanMessage(t('MAPPING RIDGE DENSITY...'));
        if (progress === 72) setScanMessage(t('VAULT DECRYPTION CORE...'));
      }
    }, 60);
  };

  const cancelFingerprintScan = () => {
    if (fingerprintState === 'success') return;
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    setFingerprintState('failed');
    setFingerprintProgress(0);
    setScanMessage(t('SCAN FAILED // RETRY HOLD'));
    if ('vibrate' in navigator) {
      navigator.vibrate([200]);
    }

    setTimeout(() => {
      setFingerprintState('idle');
      setScanMessage(t('TOUCH & HOLD SCANNER'));
    }, 1800);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800); // 1.8s epic loader
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden relative font-sans">

      {/* BACKGROUND DECORATIVE FX */}
      <div className="absolute top-0 left-0 w-full h-[1000px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(13,255,0,0.15),transparent)] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[60%] left-[-15%] w-[600px] h-[600px] bg-brand-950/15 rounded-full blur-[180px] pointer-events-none" />

      {/* DYNAMICALLY MOVING GRID LAYER WITH PARALLAX */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(13,255,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(13,255,0,0.025)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_75%,transparent_100%)] pointer-events-none z-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${mousePos.x * 0.05}px, ${mousePos.y * 0.05}px, 0)` }}
      />

      {/* MOUSE TAIL GLOW SHADOW SPOTLIGHT */}
      <div
        className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(13,255,0,0.06),transparent_60%)] pointer-events-none transition-all duration-100 ease-out z-0 hidden md:block"
        style={{ left: `${mousePos.rawX - 300}px`, top: `${mousePos.rawY - 300}px` }}
      />

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-bg-primary z-50 overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative flex items-center justify-center"
            >
              <ShieldCheck className="w-24 h-24 text-brand-500 z-10 filter drop-shadow-[0_0_25px_rgba(13,255,0,0.6)] animate-pulse" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute border-t-2 border-brand-400 border-r-2 border-transparent rounded-full w-32 h-32"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute border-b-2 border-brand-600 border-l-2 border-transparent rounded-full w-36 h-36"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-3xl font-black tracking-[0.3em] text-white uppercase font-sans"
            >
              {t('FaceShield EdgeAI')}
            </motion.h1>

            <div className="w-[180px] h-[3px] bg-neutral-850/80 mt-6 rounded-full overflow-hidden relative border border-white/5">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ delay: 0.5, duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-y-0 left-0 w-full bg-white"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 text-[10px] text-text-muted/60 tracking-[0.2em] uppercase font-mono animate-pulse"
            >
              {t('SYSTEM INITIATING • SECURE EDGE ACTIVE')}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex flex-col min-h-screen"
          >
            {/* HEADER / NAVBAR */}
            <header className="sticky top-0 bg-bg-primary/80 backdrop-blur-md border-b border-border-primary/10 z-40">
              <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
                {/* Left balanced spacer / subtle icon */}
                <div className="w-12 h-12 flex items-center justify-start">
                  <button
                    onClick={toggleTheme}
                    className="p-2 bg-bg-secondary/40 hover:bg-bg-hover border border-border-primary/20 hover:border-brand-500/40 text-brand-500/60 hover:text-brand-400 hover:scale-105 active:scale-95 rounded-xl transition-all shadow-[0_0_10px_rgba(13,255,0,0.02)] hover:shadow-[0_0_15px_rgba(13,255,0,0.15)] cursor-pointer"
                    aria-label="Toggle Theme"
                  >
                    <ShieldCheck className={`w-6 h-6 ${theme === 'light' ? 'text-brand-600' : 'text-brand-500/60'}`} />
                  </button>
                </div>

                {/* Centered Term Logo */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 flex items-center cursor-pointer group"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <span className="text-xl md:text-2xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-200 to-white uppercase font-sans select-none transition-all duration-300 group-hover:scale-105 group-hover:from-brand-300 group-hover:to-brand-300">
                    {t('FaceShield EdgeAI')}
                  </span>
                </div>

                {/* Right Aligned Hamburger Menu Button */}
                <div className="flex items-center">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2.5 bg-bg-secondary/40 hover:bg-bg-hover border border-border-primary/20 hover:border-brand-500/40 text-text-primary rounded-xl transition-all shadow-[0_0_10px_rgba(13,255,0,0.05)] hover:shadow-[0_0_15px_rgba(13,255,0,0.2)] cursor-pointer"
                    aria-label="Toggle Menu"
                  >
                    {menuOpen ? <X className="w-6 h-6 text-brand-400" /> : <Menu className="w-6 h-6 text-brand-400" />}
                  </button>
                </div>
              </div>
            </header>

            {/* FULL SCREEN NAVIGATION OVERLAY DRAWER */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="fixed inset-x-0 top-[65px] bottom-0 bg-bg-primary/95 backdrop-blur-xl z-35 flex flex-col items-center justify-center border-t border-border-primary/10 overflow-y-auto"
                >
                  {/* Cyber Grid background in Drawer */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(13,255,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

                  {/* Centered Menu Links */}
                  <nav className="flex flex-col items-center space-y-6 z-10 text-center py-8">
                    {[
                      { name: t("Platform"), href: "#overview" },
                      { name: t("Core Features"), href: "#features" },
                      { name: t("RBAC Matrix"), href: "#modules" },
                      { name: t("Live Feeds"), href: "#realtime" },
                      { name: t("Industries"), href: "#industries" },
                      { name: t("Architects"), href: "#team" },
                      { name: t("FAQ"), href: "#faq" }
                    ].map((item, idx) => (
                      <motion.a
                        key={idx}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.04 }}
                        className="text-2xl font-extrabold text-text-secondary hover:text-brand-400 tracking-widest transition-colors duration-300 font-papyrus relative group uppercase"
                      >
                        {item.name}
                        <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-0 h-[2px] bg-brand-500 transition-all duration-300 group-hover:w-1/2" />
                      </motion.a>
                    ))}

                    {/* Theme Toggle Button inside the drawer */}
                    <motion.button
                      onClick={toggleTheme}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 }}
                      className="px-5 py-2.5 mt-2 bg-bg-secondary/40 hover:bg-bg-hover border border-border-primary/20 hover:border-brand-500/40 text-brand-500/60 hover:text-brand-400 hover:scale-105 active:scale-95 rounded-xl transition-all shadow-[0_0_10px_rgba(13,255,0,0.02)] hover:shadow-[0_0_15px_rgba(13,255,0,0.15)] cursor-pointer flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider"
                      aria-label="Toggle Theme in Menubar"
                    >
                      <ShieldCheck className={`w-5 h-5 ${theme === 'light' ? 'text-brand-600' : 'text-brand-500/60'}`} />
                      <span>{theme === 'light' ? t('Dark Mode') : t('Light Mode')}</span>
                    </motion.button>

                    {/* Divider */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "160px" }}
                      className="h-[1px] bg-border-primary/20 my-4"
                    />

                    {/* Navigation Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col sm:flex-row gap-4 w-full px-6"
                    >
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate('/login');
                        }}
                        className="px-6 py-3 bg-brand-900/40 hover:bg-brand-900/80 border border-brand-500/30 text-sm font-bold text-text-primary rounded-xl transition-all hover:border-brand-500 hover:shadow-[0_0_15px_rgba(13,255,0,0.25)] cursor-pointer text-center uppercase tracking-wider"
                      >
                        {t('Control Room')}
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate('/kiosk');
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-sm font-bold text-text-primary rounded-xl transition-all shadow-[0_0_20px_rgba(13,255,0,0.3)] hover:scale-105 active:scale-95 cursor-pointer text-center uppercase tracking-wider"
                      >
                        {t('Launch Kiosk')}
                      </button>
                    </motion.div>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SECTION 1: HERO SECTION */}
            <section className="relative pt-16 pb-24 px-6 overflow-hidden">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Hero Left Info */}
                <div className="lg:col-span-7 space-y-8 text-left z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center space-x-2 bg-brand-950/60 border border-brand-500/20 rounded-full px-4.5 py-2 backdrop-blur-md"
                  >
                    <span className="flex w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping"></span>
                    <span className="flex w-2.5 h-2.5 rounded-full bg-brand-500 absolute"></span>
                    <span className="text-[11px] font-mono font-bold tracking-widest text-brand-300 uppercase">
                      {t('NHAI INNOVATION HACKATHON 7.0 | PROTOCOL ACTIVE')}
                    </span>
                  </motion.div>

                  <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
                    <span className="font-papyrus text-transparent bg-clip-text bg-gradient-to-br from-text-primary via-brand-200 to-brand-400">
                      {t('Zero Network. Zero Fraud.')}
                    </span> <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 filter drop-shadow-[0_2px_10px_rgba(13,255,0,0.15)]">
                      {t('Instant Identity.')}
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl text-text-muted leading-relaxed font-light max-w-2xl">
                    {t('Unify your industrial workspace for NHAI. FaceShield EdgeAI bridges tactical offline-first operations, 3-Signal Passive Liveness, PPE compliance, and real-time geofencing into a zero-trust workforce OS.')}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                    <button
                      onClick={() => navigate('/login')}
                      className="group flex items-center justify-center space-x-3 px-8 py-4.5 bg-brand-600 hover:bg-brand-500 text-text-primary rounded-2xl font-bold text-lg transition-all shadow-[0_0_35px_rgba(13,255,0,0.35)] hover:shadow-[0_0_55px_rgba(13,255,0,0.55)] hover:-translate-y-1 cursor-pointer"
                    >
                      <span>{t('Enter Control Center')}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                    </button>
                    <button
                      onClick={() => navigate('/kiosk')}
                      className="flex items-center justify-center space-x-2 px-8 py-4.5 bg-bg-secondary hover:bg-bg-hover border border-border-primary/20 hover:border-brand-500/40 text-text-secondary hover:text-text-primary rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 cursor-pointer"
                    >
                      <Cpu className="w-5 h-5" />
                      <span>{t('Deploy Kiosk Screen')}</span>
                    </button>
                  </div>

                  {/* Core Telemetry Strip */}
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border-primary/10 max-w-xl">
                    <div>
                      <div className="text-3xl font-black text-brand-400 font-mono">20ms</div>
                      <div className="text-xs text-text-muted tracking-wider uppercase font-mono">{t('Scan Latency')}</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-brand-400 font-mono">100%</div>
                      <div className="text-xs text-text-muted tracking-wider uppercase font-mono">{t('Offline Uptime')}</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-brand-400 font-mono">10K+</div>
                      <div className="text-xs text-text-muted tracking-wider uppercase font-mono">{t('Active Nodes')}</div>
                    </div>
                  </div>
                </div>

                {/* Hero Right Visual (Tactical Telemetry Frame) */}
                <div className="lg:col-span-5 relative z-10">
                  <div className="relative border border-brand-500/30 bg-bg-secondary/40 rounded-3xl p-6 backdrop-blur-md shadow-[0_0_40px_rgba(13,255,0,0.15)] overflow-hidden">
                    {/* Top status bar */}
                    <div className="flex justify-between items-center mb-6 border-b border-brand-500/10 pb-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
                        <span className="text-xs font-mono font-bold tracking-widest text-text-secondary uppercase">{t('MONITORING CONSOLE Alpha')}</span>
                      </div>
                      <div className="text-[10px] font-mono text-brand-400 bg-brand-950 px-2 py-0.5 rounded border border-brand-500/20">
                        {t('LIVE')}
                      </div>
                    </div>

                    {/* Interactive Mobile Fingerprint Scanner Widget */}
                    <div
                      className={`h-64 rounded-2xl relative flex flex-col items-center justify-center overflow-hidden transition-all duration-300 border cursor-pointer select-none ${fingerprintState === 'scanning' ? 'bg-brand-950/40 border-brand-500 shadow-[0_0_30px_rgba(13,255,0,0.2)]' :
                        fingerprintState === 'success' ? 'bg-brand-950/20 border-brand-500 shadow-[0_0_30px_rgba(13,255,0,0.3)]' :
                          fingerprintState === 'failed' ? 'bg-brand-950/20 border-brand-500/80 shadow-[0_0_30px_rgba(13,255,0,0.2)]' :
                            'bg-bg-primary/80 border-brand-500/10 hover:border-brand-500/30'
                        }`}
                      onMouseDown={startFingerprintScan}
                      onMouseUp={cancelFingerprintScan}
                      onMouseLeave={cancelFingerprintScan}
                      onTouchStart={startFingerprintScan}
                      onTouchEnd={cancelFingerprintScan}
                      onTouchCancel={cancelFingerprintScan}
                    >
                      {/* Cyber Grid background */}
                      <div className="absolute inset-0 bg-[radial-gradient(rgba(13,255,0,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                      {/* Expanding Laser Ring while scanning */}
                      {fingerprintState === 'scanning' && (
                        <>
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0.8 }}
                            animate={{ scale: 2.2, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
                            className="absolute w-24 h-24 border border-brand-500 rounded-full pointer-events-none"
                          />
                          <motion.div
                            initial={{ scale: 0.6, opacity: 1 }}
                            animate={{ scale: 1.8, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut", delay: 0.4 }}
                            className="absolute w-24 h-24 border-2 border-brand-400/50 rounded-full pointer-events-none"
                          />
                        </>
                      )}

                      {/* Biometric Scan Line */}
                      {fingerprintState === 'scanning' && (
                        <motion.div
                          animate={{ top: ['10%', '90%', '10%'] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_8px_rgba(13,255,0,0.8)] z-20 pointer-events-none"
                        />
                      )}

                      <div className="text-center z-10 space-y-4">
                        <div className="relative flex items-center justify-center">
                          {/* Circular progress bar wrapping fingerprint */}
                          {fingerprintState === 'scanning' && (
                            <svg className="absolute w-24 h-24 -rotate-90 pointer-events-none">
                              <circle
                                cx="48" cy="48" r="42"
                                className="stroke-brand-950 fill-none stroke-2"
                              />
                              <circle
                                cx="48" cy="48" r="42"
                                className="stroke-brand-500 fill-none stroke-2 transition-all duration-75"
                                strokeDasharray={2 * Math.PI * 42}
                                strokeDashoffset={2 * Math.PI * 42 * (1 - fingerprintProgress / 100)}
                              />
                            </svg>
                          )}

                          <motion.div
                            animate={fingerprintState === 'scanning' ? { scale: [1, 0.95, 1.05, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 0.6 }}
                            className={`w-20 h-20 rounded-full flex items-center justify-center bg-bg-secondary border backdrop-blur-sm z-10 transition-colors duration-300 ${fingerprintState === 'scanning' ? 'border-brand-500/30' :
                              fingerprintState === 'success' ? 'border-brand-500/30 bg-brand-950/20' :
                                fingerprintState === 'failed' ? 'border-brand-500/30 bg-brand-950/20' :
                                  'border-brand-500/20'
                              }`}
                          >
                            <Fingerprint className={`w-10 h-10 transition-all duration-300 ${fingerprintState === 'scanning' ? 'text-brand-400 filter drop-shadow-[0_0_8px_rgba(13,255,0,0.6)]' :
                              fingerprintState === 'success' ? 'text-brand-400 filter drop-shadow-[0_0_12px_rgba(13,255,0,0.6)]' :
                                fingerprintState === 'failed' ? 'text-brand-400 filter drop-shadow-[0_0_8px_rgba(13,255,0,0.6)]' :
                                  'text-brand-500 hover:text-brand-400'
                              }`} />
                          </motion.div>
                        </div>

                        <div className="font-mono space-y-1">
                          <div className={`text-[10px] tracking-widest font-bold ${fingerprintState === 'success' ? 'text-brand-400' :
                            fingerprintState === 'failed' ? 'text-brand-400' :
                              fingerprintState === 'scanning' ? 'text-brand-300' :
                                'text-text-muted'
                            }`}>
                            {scanMessage}
                          </div>
                          {fingerprintState === 'scanning' && (
                            <div className="text-[9px] text-brand-400/80">{t('{{progress}}% CAPTURED', { progress: fingerprintProgress })}</div>
                          )}
                          {fingerprintState === 'success' && (
                            <div className="text-[9px] text-brand-400/70 font-semibold animate-pulse">{t('REDIRECTING TO CONTROL ROOM...')}</div>
                          )}
                          {fingerprintState === 'idle' && (
                            <div className="text-[9px] text-brand-500/50 uppercase">{t('TOUCH-ID MOBILE PORTAL')}</div>
                          )}
                        </div>
                      </div>

                      {/* Floating indicators */}
                      <div className="absolute top-3 left-3 bg-brand-950/70 border border-brand-500/20 px-2 py-1 rounded text-[8px] font-mono text-brand-400">
                        {t('SYS: MOBILE_VALIDATOR')}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-brand-950/70 border border-brand-500/20 px-2 py-1 rounded text-[8px] font-mono text-brand-400">
                        {t('SECURE EDGE')}
                      </div>
                    </div>

                    {/* Simulation logs display */}
                    <div className="mt-6 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-text-muted">{t('[16:27:32] API Boot sequence')}</span>
                        <span className="text-brand-400 font-bold">{t('READY')}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-text-muted">{t('[16:27:34] DB Client synced')}</span>
                        <span className="text-brand-400 font-bold">{t('100% OK')}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-text-muted">{t('[16:27:35] Operators list')}</span>
                        <span className="text-brand-300">{t('8 OPERATORS ONLINE')}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 2: PLATFORM OVERVIEW SECTION */}
            <section id="overview" className="py-24 px-6 border-t border-border-primary/10 relative">
              <div className="max-w-7xl mx-auto text-center space-y-12">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('01 // PLATFORM OVERVIEW')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Unified Command & Control Architecture')}
                  </h3>
                  <p className="text-text-muted text-lg font-light leading-relaxed">
                    {t('FaceShield EdgeAI orchestrates multi-tiered personnel layers across physical sites and virtual geofences. Our framework ensures absolute compliance even under zero-connectivity field scenarios.')}
                  </p>
                </div>

                {/* Dashboard-Style Platform Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
                  {[
                    { title: t("Centralized Core"), count: "100%", desc: t("Dual-database hybrid core with PostgreSQL relational persistence & MongoDB asynchronous analytics offloading."), icon: Server },
                    { title: t("Biometric Nodes"), count: "20ms", desc: t("Local ONNX model inference for UltraFace/ArcFace biometric validation in under 20ms."), icon: Scan },
                    { title: t("Tactical Geofencing"), count: "99.98%", desc: t("GPS containment checks validated dynamically against Site center radius bounds via the Haversine formula."), icon: Map },
                    { title: t("Operational Sync"), count: "0% Leak", desc: t("Resilient IndexedDB local cache queue and Service Worker background sync ensures zero log loss."), icon: Database }
                  ].map((node, i) => (
                    <div key={i} className="bg-bg-secondary/40 border border-border-primary/10 hover:border-brand-500/40 p-8 rounded-3xl backdrop-blur-sm transition-all duration-300 group hover:-translate-y-1.5">
                      <div className="bg-brand-950/60 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-brand-500/20 group-hover:border-brand-500/50 transition-colors">
                        <node.icon className="w-6 h-6 text-brand-400" />
                      </div>
                      <div className="text-4xl font-extrabold text-brand-300 font-mono mb-2">{node.count}</div>
                      <h4 className="text-xl font-bold mb-3 font-papyrus text-text-primary">{node.title}</h4>
                      <p className="text-text-muted text-sm leading-relaxed">{node.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 3: CORE FEATURES SECTION */}
            <section id="features" className="py-24 px-6 bg-bg-secondary/20 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
                  <div className="space-y-4 max-w-2xl text-left">
                    <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                      {t('02 // TECHNICAL SUITE')}
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                      {t('Core Operations Engine')}
                    </h3>
                  </div>
                  <p className="text-text-muted text-lg font-light leading-relaxed max-w-md text-left lg:text-right">
                    {t('Engineered to address remote infrastructure challenges, combining biometric hardware integration with lightweight browser capabilities.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {[
                    {
                      icon: BrainCircuit,
                      title: t("Machine Intelligence Hub"),
                      spec: t("ONNX Face, Liveness & PPE"),
                      desc: t("Runs local UltraFace and ArcFace ONNX models to extract 512D face embeddings, utilizing a 3-Signal Passive Liveness Engine to block spoofing, alongside real-time PPE compliance auditing.")
                    },
                    {
                      icon: Database,
                      title: t("IndexedDB Synchronization"),
                      spec: t("Resilient Storage Matrix"),
                      desc: t("Caches secure checklists, logs, and attendance cards locally inside client browser IndexedDB sandboxes. Background Service Workers automatically sync data when networks reconnect.")
                    },
                    {
                      icon: Users,
                      title: t("Contractor Lifecycle Hub"),
                      spec: t("Multi-Tier Vendor Control"),
                      desc: t("Onboard sub-contractors and assign worker roles under active vendor agreements. Synchronize physical credentials directly into primary transactional databases.")
                    }
                  ].map((feat, i) => (
                    <div key={i} className="relative group bg-bg-primary/60 border border-border-primary/10 hover:border-brand-500/30 p-8 rounded-3xl backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(13,255,0,0.1)] hover:-translate-y-2 text-left">
                      <div className="bg-brand-950/80 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-brand-500/20 group-hover:border-brand-500/40 transition-all duration-300">
                        <feat.icon className="w-7 h-7 text-brand-400" />
                      </div>
                      <div className="text-[10px] font-mono text-brand-400 font-bold uppercase tracking-widest mb-2">{feat.spec}</div>
                      <h4 className="text-2xl font-bold mb-4 font-papyrus">{feat.title}</h4>
                      <p className="text-text-muted text-base leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 4: ENTERPRISE MODULES SECTION */}
            <section className="py-24 px-6 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto text-center space-y-16">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('03 // DEPLOYMENT ENVIRONMENT')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Enterprise Module Ecosystem')}
                  </h3>
                  <p className="text-text-muted text-lg font-light leading-relaxed">
                    {t('Four purpose-built tactical modules aligned to the specific workflow responsibilities of site commanders and contractors alike.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                  {[
                    {
                      title: t("Control Room"),
                      role: t("Operational Command"),
                      features: [t("Global site oversight"), t("Live security override keys"), t("Aggregated workforce metrics"), t("Fatigue forecasting")],
                      desc: t("The nerve center for operations executives and master administrators to command, review compliance, and audit."),
                      icon: Radio
                    },
                    {
                      title: t("Security Desk"),
                      role: t("On-Site Enforcement"),
                      features: [t("Real-time guard logs"), t("Manual override check-ins"), t("Local geofence monitoring"), t("Active incident alarms")],
                      desc: t("Equips guards with a sleek, low-friction mobile console to check contractor cards, flag violations, and review faces."),
                      icon: ShieldCheck
                    },
                    {
                      title: t("Biometric Hub"),
                      role: t("System Onboarding"),
                      features: [t("3D structural scan"), t("Anti-spoofing profiling"), t("Dynamic credential injection"), t("Personal info hashing")],
                      desc: t("Streamlined dashboard for security staff to capture new contractor biometrics safely while storing PII under heavy encryption."),
                      icon: Fingerprint
                    },
                    {
                      title: t("Operations Suite"),
                      role: t("Contractor & Schedule Hub"),
                      features: [t("Shift matrix planning"), t("Compliance verification"), t("Vendor cost centers"), t("Automated Excel reports")],
                      desc: t("Where contractor supervisors regulate rosters, inspect contractor licenses, export compliance audits, and manage shifts."),
                      icon: Briefcase
                    }
                  ].map((mod, i) => (
                    <div key={i} className="bg-bg-secondary/40 border border-border-primary/15 rounded-3xl p-8 backdrop-blur-sm flex flex-col justify-between hover:border-brand-500/40 hover:bg-bg-secondary transition-all duration-300">
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <span className="bg-brand-950 border border-brand-500/20 px-3 py-1 rounded-lg text-xs font-mono font-bold text-brand-400 uppercase tracking-wider">
                            {mod.role}
                          </span>
                          <mod.icon className="w-6 h-6 text-brand-500" />
                        </div>
                        <h4 className="text-2xl font-bold font-papyrus text-text-primary mb-3">{mod.title}</h4>
                        <p className="text-text-muted text-sm leading-relaxed mb-6">{mod.desc}</p>
                      </div>
                      <ul className="space-y-2 border-t border-border-primary/10 pt-4 text-xs font-mono text-text-secondary">
                        {mod.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 5: ROLE-BASED ACCESS SECTION (INTERACTIVE WIDGET) */}
            <section id="modules" className="py-24 px-6 bg-bg-secondary/20 border-t border-border-primary/10">
              <RoleMatrixWidget />
            </section>

            {/* SECTION 6: LIVE REALTIME SYSTEM SECTION (CLI SIMULATION) */}
            <section id="realtime" className="py-24 px-6 border-t border-border-primary/10 relative">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                <div className="lg:col-span-5 text-left space-y-6">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('05 // LIVE AUDIT STREAM')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Simulated Real-Time Operational Feed')}
                  </h3>
                  <p className="text-text-muted text-lg font-light leading-relaxed">
                    {t('Watch the distributed core sync in action. Below is the tactical system stream outputting telemetry from authorized active administrators, field personnel, and biometric nodes.')}
                  </p>
                  <div className="p-4 bg-brand-950/60 border border-brand-500/20 rounded-2xl flex items-center space-x-3 max-w-md">
                    <Radio className="w-6 h-6 text-brand-500 animate-pulse shrink-0" />
                    <span className="text-xs font-mono text-brand-300">
                      {t('Channel active. Displaying cryptographically signed operator reports.')}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <CommandLineTerminal personnel={personnelList} />
                </div>

              </div>
            </section>

            {/* SECTION 7: FACE RECOGNITION SECTION (INTERACTIVE RADAR SCREEN) */}
            <section className="py-24 px-6 bg-bg-secondary/10 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                <div className="lg:col-span-6 order-2 lg:order-1">
                  <FaceScannerSimulation />
                </div>

                <div className="lg:col-span-6 text-left space-y-8 order-1 lg:order-2">
                  <div className="space-y-4">
                    <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                      {t('06 // NEURAL SYSTEMS')}
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                      {t('High-Precision Face Matching Grid')}
                    </h3>
                  </div>

                  <p className="text-text-muted text-lg font-light leading-relaxed">
                    {t('Using local computer vision and deep learning models, FaceShield EdgeAI maps structural face vectors dynamically. It operates directly inside browser tabs or standalone kiosks using ONNX runtime without requiring cloud-dependent matching databases, guaranteeing immediate, private clearance speeds.')}
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-bg-secondary/40 border border-border-primary/10 rounded-2xl">
                      <div className="text-brand-400 font-mono font-bold mb-1">{t('pgvector MATCHING')}</div>
                      <div className="text-xs text-text-muted">{t('Calculates cosine similarity in PostgreSQL with a 0.55 similarity threshold.')}</div>
                    </div>
                    <div className="p-4 bg-bg-secondary/40 border border-border-primary/10 rounded-2xl">
                      <div className="text-brand-400 font-mono font-bold mb-1">{t('VARIANCE TRAP < 1e-4')}</div>
                      <div className="text-xs text-text-muted">{t('Enforces variance checks on 512D face embeddings to prevent flat photo mock spoofing.')}</div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 8: GEOFENCING SECTION */}
            <section className="py-24 px-6 border-t border-border-primary/10 relative">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                <div className="lg:col-span-6 text-left space-y-6">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('07 // GEO-SPATIAL RADAR')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Haversine Geofence Checking')}
                  </h3>
                  <p className="text-text-muted text-lg font-light leading-relaxed">
                    {t('Define operational yards and site centers directly inside the dashboard. FaceShield EdgeAI tracks worker positions locally, checking real-time coordinates against site radius thresholds in meters using the mathematical Haversine formula.')}
                  </p>

                  <div className="space-y-4">
                    {[
                      t("Enforces perimeter bounds by computing real-time coordinate distances against Site center points"),
                      t("Dynamic GPS coordination using the reliable Haversine formula"),
                      t("Autonomous local geofence checking with automatic high-severity incident alerts raised on breaches")
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3 text-sm text-text-secondary">
                        <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <GeofenceSimulator />
                </div>

              </div>
            </section>

            {/* SECTION 9: OFFLINE-FIRST INFRASTRUCTURE SECTION */}
            <section className="py-24 px-6 bg-bg-secondary/20 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                <div className="lg:col-span-6 order-2 lg:order-1">
                  <OfflineQueueSimulator />
                </div>

                <div className="lg:col-span-6 text-left space-y-6 order-1 lg:order-2">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('08 // RESILIENCE PROTOCOLS')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Offline-First Infrastructure')}
                  </h3>
                  <p className="text-text-muted text-lg font-light leading-relaxed">
                    {t('Designed specifically for high-risk remote sites like offshore platforms or deep mines. With a built-in IndexedDB queue, FaceShield EdgeAI operates completely disconnected. When network signals reappear, the sync agent pushes cached audits to PostgreSQL without conflict.')}
                  </p>

                  <div className="bg-bg-primary/80 border border-brand-500/25 p-5 rounded-2xl font-mono text-xs text-brand-300">
                    <div className="flex items-center space-x-2 mb-2 text-brand-400 font-bold">
                      <Lock className="w-4 h-4" />
                      <span>{t('AES-GCM-256 SECURED PERSISTENCE')}</span>
                    </div>
                    {t('All cached attendance checks, timestamp logs, and biometric meshes are encrypted on local sandboxes to protect private worker data.')}
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 10: INTELLIGENCE SECTION */}
            <section className="py-24 px-6 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('09 // COGNITIVE FORECASTING')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Behavioral Intelligence')}
                  </h3>
                  <p className="text-text-muted text-lg font-light">
                    {t('FaceShield EdgeAI leverages machine learning to forecast fatigue cycles, anomalies in contractor schedules, and risk flags across high-impact facilities.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: t("Fatigue Analysis Engine"),
                      desc: t("Tracks micro-variances in shifts and biometrics to detect operator cognitive fatigue, issuing automated rostering safeguards before accidents occur."),
                      stat: t("42% Accident Drop")
                    },
                    {
                      title: t("Anomaly Guard Protocols"),
                      desc: t("Flags abnormal operational movements, suspicious offline-sync behaviors, or biometric mismatch spikes within minutes using local neural engines."),
                      stat: t("0.01% False Positives")
                    },
                    {
                      title: t("Cognitive Shift Builder"),
                      desc: t("Rosters contractors automatically based on local site history, certification status, fatigue factors, and spatial site density limits."),
                      stat: t("85% Rostering Efficiency")
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-bg-secondary/40 border border-border-primary/10 p-8 rounded-3xl text-left hover:border-brand-500/30 transition-colors">
                      <div className="text-xs font-mono text-brand-400 font-bold uppercase tracking-wider mb-2">{t('INTELLIGENCE NODE')}</div>
                      <h4 className="text-2xl font-bold font-papyrus text-text-primary mb-4">{item.title}</h4>
                      <p className="text-text-muted text-sm leading-relaxed mb-6">{item.desc}</p>
                      <div className="text-3xl font-black font-mono text-brand-300">{item.stat}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 11: SECURITY & COMPLIANCE SECTION */}
            <section className="py-24 px-6 bg-bg-secondary/20 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                <div className="lg:col-span-6 text-left space-y-6">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('10 // ZERO TRUST COMPLIANCE')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Security & Regulatory Hardening')}
                  </h3>
                  <p className="text-text-muted text-lg font-light leading-relaxed">
                    {t('Engineered to satisfy deep industrial mandates. Our platform ensures biometric privacy while supplying unalterable compliance trails for auditing authorities.')}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {[
                      { title: t("Immutable Auditing"), desc: t("Every administrative shift adjustment or biometric override is captured on read-only audit log registries.") },
                      { title: t("Biometric Anonymization"), desc: t("Raw imagery is discarded instantly. Only cryptographic vector representations are kept.") },
                      { title: t("ISO-27001 Preparedness"), desc: t("Strict RBAC segregation, encrypted database channels, and automated key rotation cycles.") },
                      { title: t("GDPR/CCPA Compliance"), desc: t("Right to be forgotten and data erasure APIs built directly inside the operations engine.") }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center space-x-2 text-brand-400 font-bold font-mono text-xs uppercase">
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span>{item.title}</span>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="bg-bg-primary border border-brand-500/20 p-8 rounded-3xl text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl" />
                    <div className="flex items-center space-x-3 mb-6">
                      <Lock className="w-8 h-8 text-brand-500" />
                      <h4 className="text-xl font-bold font-papyrus">{t('Hardened Vault Metrics')}</h4>
                    </div>

                    <div className="space-y-4 font-mono text-xs">
                      <div className="flex justify-between py-2 border-b border-border-primary/10">
                        <span className="text-text-muted">{t('Transport Encryption')}</span>
                        <span className="text-brand-400 font-bold">{t('TLS 1.3 / HTTPS')}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border-primary/10">
                        <span className="text-text-muted">{t('Storage Encryption')}</span>
                        <span className="text-brand-400 font-bold">{t('AES-GCM-256')}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border-primary/10">
                        <span className="text-text-muted">{t('Authentication Protocol')}</span>
                        <span className="text-brand-400 font-bold">{t('Role-Based JWT')}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-text-muted">{t('Audit Verification')}</span>
                        <span className="text-brand-400 font-bold">{t('SHA-256 Ledgers')}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 12: INDUSTRIAL WORKFLOW SECTION */}
            <section className="py-24 px-6 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto text-center space-y-16">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('11 // THE PIPELINE')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Integrated Industrial Workflow')}
                  </h3>
                  <p className="text-text-muted text-lg font-light">
                    {t('The four phases of our secure, unified workflow tracking contractors from off-site preparation to secure exit records.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left relative">
                  {/* Decorative linking lines */}
                  <div className="hidden md:block absolute top-[2.25rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-900 via-brand-500/20 to-brand-900 z-0" />

                  {[
                    { step: "01", title: t("Roster Preparation"), desc: t("Operations teams plan shifts and pre-register contractor information in the operational console."), icon: Briefcase },
                    { step: "02", title: t("Kiosk Verification"), desc: t("Contractors arrive, perform a local ONNX face recognition scan or ORB fingerprint check in 20ms."), icon: Scan },
                    { step: "03", title: t("Active Geofence Monitor"), desc: t("Worker steps into the zone; spatial background routines ensure localized containment via Haversine geofence checks."), icon: Map },
                    { step: "04", title: t("Automatic Sync Checkout"), desc: t("Contractor checks out. Attendance data syncs and pushes to PostgreSQL, with audit trails logged to MongoDB."), icon: Database }
                  ].map((item, idx) => (
                    <div key={idx} className="relative z-10 bg-bg-secondary/40 border border-border-primary/10 rounded-2xl p-6 backdrop-blur-sm hover:border-brand-500/30 transition-colors">
                      <div className="w-11 h-11 bg-brand-950 border border-brand-500/30 rounded-xl flex items-center justify-center font-mono font-bold text-brand-400 mb-6">
                        {item.step}
                      </div>
                      <h4 className="text-lg font-bold font-papyrus text-text-primary mb-2">{item.title}</h4>
                      <p className="text-text-muted text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 13: ANALYTICS & REPORTING SECTION */}
            <section className="py-24 px-6 bg-bg-secondary/10 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                <div className="lg:col-span-6 text-left space-y-6">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('12 // DEEP METRICS')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Auditable Reporting & Analytics')}
                  </h3>
                  <p className="text-text-muted text-lg font-light leading-relaxed">
                    {t('FaceShield EdgeAI delivers a robust reporting framework. Generate complex payroll compliance sheets, detailed contractor rosters, geofence alarm occurrences, and biometric match percentages in one click.')}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FileSpreadsheet className="w-5 h-5 text-brand-400 shrink-0" />
                      <span className="text-sm text-text-secondary font-mono">{t('One-Click Excel / CSV Exports')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-brand-400 shrink-0" />
                      <span className="text-sm text-text-secondary font-mono">{t('Real-Time Contractor Performance Dashboards')}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="bg-bg-primary/95 border border-brand-500/20 p-6 rounded-3xl text-left space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-border-primary/10">
                      <span className="font-mono text-xs font-bold text-brand-400 tracking-wider">{t('MONTHLY SITE COMPLIANCE')}</span>
                      <span className="text-[10px] font-mono text-text-muted">{t('UPDATED 1m AGO')}</span>
                    </div>

                    {/* Simulated Bar Charts with simple HTML/CSS */}
                    <div className="space-y-4">
                      {[
                        { label: t("Mining Site Alpha"), pct: 98, color: "bg-brand-500" },
                        { label: t("Operations Yard B"), pct: 92, color: "bg-brand-600" },
                        { label: t("High-Security Vault 4"), pct: 100, color: "bg-brand-400" },
                        { label: t("Logistics Terminal"), pct: 86, color: "bg-brand-700" }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-text-secondary">{item.label}</span>
                            <span className="text-brand-300 font-bold">{t('{{pct}}% compliant', { pct: item.pct })}</span>
                          </div>
                          <div className="w-full bg-brand-950 h-2 rounded-full overflow-hidden border border-brand-500/10">
                            <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 14: KIOSK SYSTEM SECTION */}
            <section className="py-24 px-6 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                <div className="lg:col-span-6 order-2 lg:order-1">
                  <div className="border-4 border-brand-900 bg-kiosk-bg p-6 rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(13,255,0,0.3)]">
                    {/* Scanner glow bar */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-1 bg-brand-500 rounded-full filter blur-[1px]" />

                    <div className="bg-black/80 rounded-2xl p-6 text-center space-y-6 min-h-[300px] flex flex-col justify-center border border-brand-500/20">
                      <Scan className="w-16 h-16 text-brand-500 mx-auto animate-pulse" />
                      <div className="space-y-2">
                        <div className="text-xl font-bold font-mono tracking-widest text-brand-400">{t('POSITION FACE IN FRONT OF CAMERA')}</div>
                        <p className="text-xs text-text-muted max-w-xs mx-auto">{t('Stand within the marker lines. Dynamic offline matching is active.')}</p>
                      </div>

                      <div className="pt-4 border-t border-brand-900/60 flex justify-center space-x-6 text-[10px] font-mono text-text-muted">
                        <span>{t('KIOSK-ID: #K-4029')}</span>
                        <span>{t('LATENCY: 18ms')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 text-left space-y-6 order-1 lg:order-2">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('13 // EDGE HARDWARE')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Dedicated Biometric Kiosk Interface')}
                  </h3>
                  <p className="text-text-muted text-lg font-light leading-relaxed">
                    {t('Designed to be operated on tablets or mounting hardware located at entry gates. It provides rapid local feedback and caches all shift data to the internal storage queue during high-traffic shift changes, avoiding long verification queues.')}
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate('/kiosk')}
                      className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-text-primary font-bold rounded-xl transition-all shadow-md hover:shadow-brand-500/30 cursor-pointer"
                    >
                      {t('Initialize Test Kiosk')}
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 15: ENTERPRISE ADVANTAGES SECTION */}
            <section className="py-24 px-6 bg-bg-secondary/20 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto text-center space-y-16">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('14 // PLATFORM COMPARISON')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('The FaceShield EdgeAI Advantage')}
                  </h3>
                  <p className="text-text-muted text-lg font-light">
                    {t('How FaceShield EdgeAI bypasses legacy constraints to deliver reliable industrial-grade workforce security.')}
                  </p>
                </div>

                {/* Comparison Table */}
                <div className="max-w-5xl mx-auto overflow-x-auto rounded-3xl border border-border-primary/15">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-950 border-b border-border-primary/20">
                        <th className="p-5 font-mono text-xs font-bold text-brand-400 uppercase tracking-widest">{t('Capabilities')}</th>
                        <th className="p-5 font-mono text-xs font-bold text-brand-400 uppercase tracking-widest">{t('Traditional Badging')}</th>
                        <th className="p-5 font-mono text-xs font-bold text-brand-400 uppercase tracking-widest bg-brand-900/30">{t('FaceShield EdgeAI OS')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-primary/10 text-sm">
                      {[
                        { cap: t("Offline-First Synchronization"), legacy: t("Requires continuous WAN connections"), modern: t("Autonomous IndexedDB, instant local persistence") },
                        { cap: t("Biometric Processing Speed"), legacy: t("Requires cloud API calls (3-5 seconds)"), modern: t("On-device WebAssembly mesh processing (20ms)") },
                        { cap: t("Identity Spoof Guarding"), legacy: t("None - badges easily shared or lost"), modern: t("Passive liveness neural models built directly in browser") },
                        { cap: t("Geofence Enforcement"), legacy: t("Requires custom expensive GPS wearables"), modern: t("Device-agnostic browser location tracking with audit logs") },
                        { cap: t("Role-Based Customization"), legacy: t("Static flat admin roles only"), modern: t("9 distinct granular organizational workflows (RBAC)") }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-bg-secondary/40 transition-colors">
                          <td className="p-5 font-bold font-papyrus text-text-primary">{row.cap}</td>
                          <td className="p-5 text-text-muted font-light">{row.legacy}</td>
                          <td className="p-5 text-brand-300 font-bold bg-brand-900/10">{row.modern}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SECTION 16: INDUSTRIES SECTION */}
            <section id="industries" className="py-24 px-6 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto text-center space-y-16">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('15 // DOMAIN COMPATIBILITY')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Built for Demanding Industries')}
                  </h3>
                  <p className="text-text-muted text-lg font-light">
                    {t('Delivering zero-trust access controls under challenging operational settings.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                  {[
                    { title: t("Mining & Heavy Metal Extraction"), desc: t("Ruggedized offline kiosk setups operating in underground locations with zero internet connection."), icon: Building2 },
                    { title: t("High-Volume Logistics Yards"), desc: t("Simultaneous high-speed geofence contractor verification to coordinate hundreds of inbound trucks."), icon: Layers },
                    { title: t("Offshore Energy Platforms"), desc: t("Strict biometric identification checklists to adhere to critical offshore maritime compliance standards."), icon: Radio },
                    { title: t("Defense & Classified Facilities"), desc: t("Multi-layered biometric approvals and cryptographic audits guarding access boundaries."), icon: Lock }
                  ].map((ind, i) => (
                    <div key={i} className="bg-bg-secondary/30 border border-border-primary/10 hover:border-brand-500/30 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 group">
                      <div className="bg-brand-950/80 w-12 h-12 rounded-xl flex items-center justify-center border border-brand-500/25 mb-6 group-hover:border-brand-500/50 transition-colors">
                        <ind.icon className="w-6 h-6 text-brand-400" />
                      </div>
                      <h4 className="text-xl font-bold font-papyrus text-text-primary mb-3">{ind.title}</h4>
                      <p className="text-xs text-text-muted leading-relaxed">{ind.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 17: TECHNOLOGY STACK SECTION */}
            <section className="py-24 px-6 bg-bg-secondary/20 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto text-center space-y-16">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('16 // TECHNICAL BLUEPRINT')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('The Modern Technology Stack')}
                  </h3>
                  <p className="text-text-muted text-lg font-light">
                    {t('Built upon scalable modern layers ensuring extreme performance under high transaction volumes.')}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
                  {[
                    { name: "React 19 + Vite", desc: t("TypeScript PWA client shell"), tag: t("UI Framework") },
                    { name: "Framer Motion", desc: t("Smooth cinematic UX feedback"), tag: t("Animations") },
                    { name: "IndexedDB + SW", desc: t("Offline storage & background sync"), tag: t("Offline Layer") },
                    { name: "NestJS Gateway", desc: t("Enterprise modular API gateway"), tag: t("Backend API") },
                    { name: "Prisma ORM", desc: t("Database mapping & pgvector hooks"), tag: t("Database ORM") },
                    { name: "PostgreSQL DB", desc: t("Primary relational transactional store"), tag: t("Database Core") },
                    { name: "MongoDB Store", desc: t("Secondary NoSQL analytics log vault"), tag: t("Secondary NoSQL") },
                    { name: "Python + FastAPI", desc: t("Computer vision microservice"), tag: t("Biometrics CV") },
                    { name: "ONNX Runtime", desc: t("Local face detection & embedding extraction"), tag: t("Neural Engine") },
                    { name: "WebSockets", desc: t("Socket.io real-time incident gate streams"), tag: t("Real-Time Layer") },
                    { name: "AES-GCM-256", desc: t("Deterministic cipher encryption locks"), tag: t("Security Core") },
                    { name: "Groq API LLM", desc: t("Predictive cognitive fatigue analysis"), tag: t("AI Layer") }
                  ].map((tech, i) => (
                    <div key={i} className="bg-bg-primary border border-border-primary/10 p-5 rounded-2xl hover:border-brand-500/35 transition-colors">
                      <span className="text-[9px] font-mono text-brand-400 font-bold uppercase tracking-wider block mb-1">{tech.tag}</span>
                      <h4 className="text-base font-bold font-mono text-text-primary mb-1">{tech.name}</h4>
                      <p className="text-xs text-text-muted">{tech.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 18: TESTIMONIALS SECTION */}
            <section className="py-24 px-6 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto text-center space-y-16">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('17 // ENDORSEMENTS')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Client Success Stories')}
                  </h3>
                  <p className="text-text-muted text-lg font-light">
                    {t('How FaceShield EdgeAI has stabilized security parameters across high-value global enterprises.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 text-left">
                  {[
                    {
                      quote: t("As a student exploring offline database design, analyzing the sync pipeline crafted by Girijesh was a revelation. It handles complex network dropouts flawlessly."),
                      author: "Gangash",
                      title: t("Student Researcher (CS)")
                    },
                    {
                      quote: t("For my thesis in neural biometrics, I compared FaceShield EdgeAI's local WASM tracking against legacy platforms. The face meshes built by Grish deliver incredible speed."),
                      author: "Devicharan",
                      title: t("Biometric Engineering Student")
                    },
                    {
                      quote: t("Examining FaceShield EdgeAI's security schemas for my cybersecurity capstone proved its absolute integrity. The JWT/AES-GCM encryption is military-grade."),
                      author: "Hariprakash",
                      title: t("Cybersecurity Undergrad")
                    },
                    {
                      quote: t("Using Godfrey's interactive local geofencing routines in my IoT apprenticeship showed me the true potential of browser edge computing."),
                      author: "Harivarshan",
                      title: t("IoT Systems Intern")
                    },
                    {
                      quote: t("Applying the 9-tier role-based access module to simulate dynamic enterprise workflows in our systems audit class worked perfectly. Unparalleled quality."),
                      author: "Harihar",
                      title: t("Operations & Auditing Student")
                    }
                  ].map((test, i) => (
                    <div key={i} className="bg-bg-secondary/40 border border-border-primary/10 p-6 rounded-3xl relative flex flex-col justify-between hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1">
                      <div className="absolute top-4 right-4 text-5xl text-brand-500/10 font-serif">“</div>
                      <p className="text-text-secondary text-xs leading-relaxed mb-6 relative z-10 font-light">
                        {test.quote}
                      </p>
                      <div className="border-t border-border-primary/10 pt-3">
                        <h4 className="font-bold text-text-primary text-sm font-papyrus capitalize">{test.author}</h4>
                        <p className="text-[10px] text-brand-400 font-mono">{test.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FOUNDING TEAM ARCHITECTS SECTION */}
            <section id="team" className="py-24 px-6 bg-bg-secondary/20 border-t border-border-primary/10">
              <div className="max-w-7xl mx-auto text-center space-y-16">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('SYSTEM ARCHITECTS')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Meet the Engineering Crew')}
                  </h3>
                  <p className="text-text-muted text-lg font-light">
                    {t('The core engineers behind the robust development of FaceShield EdgeAI OS.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
                  {coreTeam.map((member, i) => (
                    <div key={i} className="bg-bg-primary border border-brand-500/20 hover:border-brand-500/40 p-8 rounded-3xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors" />

                      <div className="text-4xl mb-4 bg-brand-950/80 w-14 h-14 rounded-2xl flex items-center justify-center border border-brand-500/25">
                        {member.avatar}
                      </div>

                      <h4 className="text-2xl font-black font-papyrus text-text-primary mb-1">{member.name}</h4>
                      <div className="text-xs text-brand-400 font-mono font-bold uppercase tracking-wider mb-4">{member.role}</div>

                      <p className="text-text-muted text-xs leading-relaxed mb-6 font-light">{member.description}</p>

                      <div className="border-t border-border-primary/10 pt-4">
                        <span className="text-[10px] font-mono text-brand-300 font-bold block mb-1">{t('PRIMARY EXPERTISE')}</span>
                        <span className="text-[11px] font-mono text-text-secondary">{member.specialty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 19: FAQ SECTION */}
            <section id="faq" className="py-24 px-6 border-t border-border-primary/10">
              <div className="max-w-4xl mx-auto text-center space-y-16">
                <div className="space-y-4">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('18 // SYSTEM INFORMATION')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus">
                    {t('Frequently Asked Questions')}
                  </h3>
                </div>

                <div className="text-left space-y-4">
                  {[
                    {
                      q: t("How does the offline-first IndexedDB system work during outages?"),
                      a: t("Whenever a contractor checks in at a kiosk or a geofence crossing triggers, our client engine validates records against a local offline cache and securely pushes the encrypted transaction to IndexedDB. Once a stable internet connection is established, our background sync agent systematically pushes the offline records to the NestJS backend API.")
                    },
                    {
                      q: t("Is contractor biometric information protected against data leakage?"),
                      a: t("Absolutely. FaceShield EdgeAI does not save raw photographs or video files of worker faces. Our local ONNX neural engine (UltraFace + ArcFace) extracts deterministic L2-normalized 512-dimensional vector embeddings. Cosine similarity matches are then checked directly in PostgreSQL using a pgvector index with a strict threshold of 0.55 and duplicate prevention limit of 0.82, keeping biometric PII fully private.")
                    },
                    {
                      q: t("What role types are supported under the Role-Based Access (RBAC) engine?"),
                      a: t("We support nine strict roles to maintain optimal operational security: Platform Head (Tier 9 - platform scope), Platform Admin (Tier 8 - platform control), Super Admin (Tier 7 - tenant command), Organization Admin (Tier 6 - org config), HR Admin (Tier 5 - compliance), Workforce Supervisor (Tier 4 - site command), Security Officer (Tier 3 - gate control), Vendor Manager (Tier 2 - vendor scope), and Contractor/Worker (Tier 1 - tracking).")
                    },
                    {
                      q: t("Can the kiosk mode run on typical Android tablets or low-spec hardware?"),
                      a: t("Yes. Our client application features WebAssembly and MediaPipe tasks compiled into local bundles, which allows hardware-accelerated face tracking directly within standard Google Chrome or Apple Safari browsers. No high-end server hardware is needed at gate structures.")
                    }
                  ].map((faqItem, idx) => (
                    <FAQAccordionItem key={idx} question={faqItem.q} answer={faqItem.a} />
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 19.5: REGISTER YOUR ORGANIZATION (MULTI-TENANT ONBOARDING) */}
            <section id="onboard-org" className="py-24 px-6 border-t border-border-primary/10 relative overflow-hidden bg-gradient-to-b from-transparent via-brand-950/20 to-transparent">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none"></div>

              <div className="max-w-6xl mx-auto space-y-12 relative z-10">
                <div className="text-center space-y-4">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
                    {t('19 // SYSTEM PROVISIONING')}
                  </h2>
                  <h3 className="text-4xl md:text-5xl font-black font-papyrus text-text-primary">
                    {t('Request Enterprise Access')}
                  </h3>
                  <p className="text-text-muted text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
                    {t('Submit an official request to clear a new organizational tenant boundary. Every submittal undergoes manual platform review and cryptographic vetting.')}
                  </p>
                </div>

                {reqSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-3xl mx-auto bg-gradient-to-br from-bg-secondary to-brand-950/40 border border-brand-500 rounded-3xl p-10 text-center relative overflow-hidden backdrop-blur-md shadow-[0_0_50px_rgba(13,255,0,0.25)]"
                  >
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

                    <CheckCircle2 className="w-16 h-16 text-brand-500 mx-auto mb-6 animate-pulse" />

                    <h3 className="text-3xl font-black font-papyrus text-text-primary uppercase mb-4">
                      {t('REQUEST SUBMITTED SUCCESSFULLY')}
                    </h3>

                    <p className="text-text-muted text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto font-light">
                      {t('Your enterprise onboarding petition is pending review. An official platform activation link with temporary credentials will be dispatched to')} <strong className="text-brand-400 font-mono">{requestForm.officialEmail}</strong> {t('once cleared by FaceShield EdgeAI platform administration.')}
                    </p>

                    <button
                      onClick={() => {
                        setReqSubmitted(false);
                        setRequestForm({
                          organizationName: '',
                          organizationType: 'Corporation',
                          industry: 'Mining',
                          organizationSize: '1-50',
                          country: 'United States',
                          address: '',
                          officialWebsite: '',
                          contactName: '',
                          contactDesignation: '',
                          officialEmail: '',
                          phone: '',
                          requestedServices: [],
                          expectedUsers: 10,
                          branchCount: 1,
                          deploymentType: 'Cloud',
                          additionalNotes: ''
                        });
                      }}
                      className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-text-primary font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(13,255,0,0.4)] hover:shadow-[0_0_30px_rgba(13,255,0,0.6)] cursor-pointer uppercase font-mono text-xs tracking-wider"
                    >
                      {t('Acknowledge Handshake')}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleOrgSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-bg-secondary/40 border border-brand-500/20 rounded-3xl p-8 backdrop-blur-md shadow-2xl">

                    {/* Left Column: Organization & Technical Specs */}
                    <div className="lg:col-span-6 space-y-6">
                      <div className="border-b border-brand-500/10 pb-4">
                        <h4 className="text-base font-bold text-brand-300 font-mono flex items-center space-x-2">
                          <Building2 className="w-5 h-5 text-brand-400" />
                          <span>{t('1. Organization & Core Metrics')}</span>
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Organization Name')}</label>
                          <input
                            type="text"
                            required
                            value={requestForm.organizationName}
                            onChange={(e) => setRequestForm({ ...requestForm, organizationName: e.target.value })}
                            placeholder={t("e.g. Shield Corp")}
                            className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition-all font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Organization Type')}</label>
                          <select
                            value={requestForm.organizationType}
                            onChange={(e) => setRequestForm({ ...requestForm, organizationType: e.target.value })}
                            className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none transition-all font-mono"
                          >
                            <option value="Corporation">{t('Corporation')}</option>
                            <option value="Government">{t('Government Agency')}</option>
                            <option value="Vendor">{t('Vendor Supplier')}</option>
                            <option value="Subcontractor">{t('Subcontractor')}</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Industry Sector')}</label>
                          <select
                            value={requestForm.industry}
                            onChange={(e) => setRequestForm({ ...requestForm, industry: e.target.value })}
                            className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none transition-all font-mono"
                          >
                            <option value="Mining">{t('Mining & Extraction')}</option>
                            <option value="Logistics">{t('Logistics & Supply Chain')}</option>
                            <option value="Energy & Utilities">{t('Energy & Utilities')}</option>
                            <option value="Construction">{t('Construction')}</option>
                            <option value="Healthcare">{t('Healthcare')}</option>
                            <option value="Retail">{t('Retail')}</option>
                            <option value="Technology">{t('Technology')}</option>
                            <option value="Defense">{t('Defense & Military')}</option>
                            <option value="Aviation">{t('Aviation')}</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Organization Size')}</label>
                          <select
                            value={requestForm.organizationSize}
                            onChange={(e) => setRequestForm({ ...requestForm, organizationSize: e.target.value })}
                            className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none transition-all font-mono"
                          >
                            <option value="1-50">{t('1-50 employees')}</option>
                            <option value="50-200">{t('50-200 employees')}</option>
                            <option value="200-1000">{t('200-1000 employees')}</option>
                            <option value="1000+">{t('1000+ employees')}</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Expected Users')}</label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={requestForm.expectedUsers}
                            onChange={(e) => setRequestForm({ ...requestForm, expectedUsers: Number(e.target.value) })}
                            className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none transition-all font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Active Branch Count')}</label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={requestForm.branchCount}
                            onChange={(e) => setRequestForm({ ...requestForm, branchCount: Number(e.target.value) })}
                            className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none transition-all font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Deployment Model')}</label>
                          <select
                            value={requestForm.deploymentType}
                            onChange={(e) => setRequestForm({ ...requestForm, deploymentType: e.target.value })}
                            className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none transition-all font-mono"
                          >
                            <option value="Cloud">{t('FaceShield EdgeAI Managed Cloud')}</option>
                            <option value="On-Premise">{t('Isolated On-Premise Grid')}</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Corporate Website')}</label>
                          <input
                            type="text"
                            value={requestForm.officialWebsite}
                            onChange={(e) => setRequestForm({ ...requestForm, officialWebsite: e.target.value })}
                            placeholder="https://shield.com"
                            className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition-all font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Country')}</label>
                          <input
                            type="text"
                            required
                            value={requestForm.country}
                            onChange={(e) => setRequestForm({ ...requestForm, country: e.target.value })}
                            className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none transition-all font-mono"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Office Address')}</label>
                          <input
                            type="text"
                            required
                            value={requestForm.address}
                            onChange={(e) => setRequestForm({ ...requestForm, address: e.target.value })}
                            placeholder={t("e.g. 100 Security Parkway, Suite 500")}
                            className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Representative & Requested Services */}
                    <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                      <div className="space-y-6">
                        <div className="border-b border-brand-500/10 pb-4">
                          <h4 className="text-base font-bold text-brand-300 font-mono flex items-center space-x-2">
                            <Users className="w-5 h-5 text-brand-400" />
                            <span>{t('2. Primary Representative & Services')}</span>
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Representative Name')}</label>
                            <input
                              type="text"
                              required
                              value={requestForm.contactName}
                              onChange={(e) => setRequestForm({ ...requestForm, contactName: e.target.value })}
                              placeholder={t("e.g. Nick Fury")}
                              className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Designation / Role')}</label>
                            <input
                              type="text"
                              required
                              value={requestForm.contactDesignation}
                              onChange={(e) => setRequestForm({ ...requestForm, contactDesignation: e.target.value })}
                              placeholder={t("e.g. Director of Operations")}
                              className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Official Email Address')}</label>
                            <input
                              type="email"
                              required
                              value={requestForm.officialEmail}
                              onChange={(e) => setRequestForm({ ...requestForm, officialEmail: e.target.value })}
                              placeholder="nfury@shield.com"
                              className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Direct Contact Phone')}</label>
                            <input
                              type="text"
                              required
                              value={requestForm.phone}
                              onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                              placeholder="+1 (555) 019-2834"
                              className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition-all font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold text-brand-400 uppercase block mb-1">{t('Requested Security Modules')}</label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { id: 'GEOFENCING', label: t('Spatial Geofences') },
                              { id: 'BIOMETRICS', label: t('Face ID Verification') },
                              { id: 'ANALYTICS', label: t('Telemetry Analytics') },
                              { id: 'INCIDENTS', label: t('Forensic Control') }
                            ].map((srv) => {
                              const isChecked = requestForm.requestedServices.includes(srv.id);
                              return (
                                <button
                                  key={srv.id}
                                  type="button"
                                  onClick={() => {
                                    const nextSrv = isChecked
                                      ? requestForm.requestedServices.filter(id => id !== srv.id)
                                      : [...requestForm.requestedServices, srv.id];
                                    setRequestForm({ ...requestForm, requestedServices: nextSrv });
                                  }}
                                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all font-mono text-left cursor-pointer ${isChecked
                                      ? 'bg-brand-950/60 border-brand-500 text-brand-300 shadow-[0_0_10px_rgba(13,255,0,0.1)]'
                                      : 'bg-black/40 border-brand-500/10 text-text-muted hover:border-brand-500/30'
                                    }`}
                                >
                                  <span>{srv.label}</span>
                                  {isChecked && <Check className="w-4 h-4 text-brand-500" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-brand-400 uppercase">{t('Case Study Narrative & Custom Requirements')}</label>
                          <textarea
                            value={requestForm.additionalNotes}
                            onChange={(e) => setRequestForm({ ...requestForm, additionalNotes: e.target.value })}
                            placeholder={t("Describe any custom integrations, SSO expectations, or specific field conditions...")}
                            rows={3}
                            className="w-full bg-black/60 border border-brand-500/20 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition-all font-sans"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                        {orgRegError && (
                          <div className="p-3 bg-brand-950/80 border border-brand-500/50 text-brand-400 text-[11px] font-mono rounded-xl flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-brand-500" />
                            <span>{orgRegError}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={orgRegLoading}
                          className="w-full flex items-center justify-center space-x-2 p-4 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-950/60 disabled:text-text-disabled text-text-primary font-bold rounded-2xl border border-brand-500/30 hover:border-brand-500 shadow-[0_0_20px_rgba(13,255,0,0.25)] hover:shadow-[0_0_30px_rgba(13,255,0,0.45)] transition-all cursor-pointer font-mono"
                        >
                          {orgRegLoading ? (
                            <>
                              <RefreshCw className="w-5 h-5 animate-spin" />
                              <span>{t('COMMITTING ACCESS PETITION...')}</span>
                            </>
                          ) : (
                            <>
                              <ArrowRight className="w-5 h-5" />
                              <span>{t('SUBMIT ENTERPRISE BOUNDARY PETITION')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </section>

            {/* SECTION 20: CALL TO ACTION SECTION */}
            <section className="py-24 px-6 bg-[radial-gradient(ellipse_at_center,rgba(13,255,0,0.1),transparent)] border-t border-border-primary/10 relative">
              <div className="max-w-5xl mx-auto bg-bg-secondary/40 border-2 border-brand-500/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden backdrop-blur-md shadow-[0_0_50px_rgba(13,255,0,0.2)]">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

                <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                  <h3 className="text-3xl md:text-5xl font-black font-papyrus text-text-primary">
                    {t('Secure Your Industrial Operations base')}
                  </h3>
                  <p className="text-text-muted text-base md:text-lg font-light leading-relaxed">
                    {t('Deploy FaceShield EdgeAI within your workspace. Enhance identity management, eliminate badging loopholes, and guarantee compliance across remote field sites.')}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate('/login')}
                      className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-text-primary font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(13,255,0,0.4)] hover:shadow-[0_0_30px_rgba(13,255,0,0.6)] cursor-pointer"
                    >
                      {t('Access Control Room')}
                    </button>
                    <button
                      onClick={() => navigate('/kiosk')}
                      className="px-8 py-4 bg-bg-primary hover:bg-bg-hover border border-border-primary/20 hover:border-brand-500/40 text-text-secondary hover:text-text-primary font-bold rounded-xl transition-all cursor-pointer"
                    >
                      {t('Launch Kiosk portal')}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 21: FOOTER SECTION */}
            <footer className="bg-bg-primary border-t border-border-primary/15 pt-16 pb-8 px-6 text-left relative z-10">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-6 h-6 text-brand-500" />
                    <span className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 font-papyrus">
                      {t('FaceShield EdgeAI OS')}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed font-light">
                    {t('The advanced biometric workforce platform engineering solid offline-first security grids for demanding global industries.')}
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-brand-400 bg-brand-950 px-2 py-1 rounded border border-brand-500/20">
                      {t('SECURE PIPELINES ONLINE')}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-xs font-bold text-text-primary uppercase tracking-widest mb-4">{t('Core Modules')}</h4>
                  <ul className="space-y-2.5 text-xs text-text-muted font-mono">
                    <li><a href="#overview" className="hover:text-brand-400 transition-colors">{t('Command Console')}</a></li>
                    <li><a href="#features" className="hover:text-brand-400 transition-colors">{t('WASM Neural Grid')}</a></li>
                    <li><a href="#modules" className="hover:text-brand-400 transition-colors">{t('Role Matrices (RBAC)')}</a></li>
                    <li><a href="#realtime" className="hover:text-brand-400 transition-colors">{t('IndexedDB Cache Sync')}</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-xs font-bold text-text-primary uppercase tracking-widest mb-4">{t('Active System Crew')}</h4>
                  <ul className="space-y-2.5 text-xs text-text-muted font-mono">
                    <li>{t('ARJUN')}</li>
                    <li>{t('Godfrey')}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-xs font-bold text-text-primary uppercase tracking-widest mb-4">{t('Tactical Status')}</h4>
                  <div className="space-y-3 font-mono text-[11px] text-text-muted">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span>{t('API Gateway (Port 3456)')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span>{t('Vite UI Server (Port 2345)')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      <span>{t('IndexedDB Active Sync Node')}</span>
                    </div>
                    <div className="text-[10px] text-brand-400 border-t border-border-primary/10 pt-2">
                      {t('Uptime: 99.9997% // All Systems Active')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto border-t border-border-primary/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-text-muted/65 font-mono">
                <div>
                  &copy; {new Date().getFullYear()} {t('FaceShield EdgeAI Enterprise OS. Crafted by Girijesh, Godfrey, and Grish.')}
                </div>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#overview" className="hover:text-brand-400">{t('Security Policies')}</a>
                  <a href="#overview" className="hover:text-brand-400">{t('Biometric Protection')}</a>
                  <a href="#overview" className="hover:text-brand-400">{t('System Logs')}</a>
                </div>
              </div>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================================
// SUB-COMPONENTS (ENCAPSULATED FOR MAXIMUM FIDELITY & MODULARITY)
// =========================================================================

/**
 * FAQ Accordion Item Component
 */
function FAQAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-bg-secondary/40 border border-border-primary/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-500/25">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-center text-left font-bold text-text-primary font-papyrus hover:bg-bg-secondary/20 transition-colors"
      >
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 text-brand-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-5 pt-0 border-t border-border-primary/5 text-sm text-text-muted leading-relaxed font-light bg-bg-primary/30">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Interactive Role-Based Matrix Selection Widget
 */
function RoleMatrixWidget() {
  const { t } = useTranslation();
  const [activeRole, setActiveRole] = useState(0);

  const roles = [
    {
      name: t("Platform Head"),
      icon: ShieldCheck,
      duties: t("System-wide aggregates, onboarding requests review, provisioning new tenants dynamically via atomic database transactions, and multi-tenant security incident monitoring."),
      users: t("Platform Owner / SaaS Executive (Global Scope)"),
      access: t("PLATFORM CONTROL TIER 9")
    },
    {
      name: t("Platform Admin"),
      icon: UserCheck,
      duties: t("Reviewing pending signup requests and auditing global security event logs/incident collections."),
      users: t("Platform Assistant Admin / Compliance Auditor"),
      access: t("PLATFORM COMPLIANCE TIER 8")
    },
    {
      name: t("Super Admin"),
      icon: ShieldCheck,
      duties: t("Single tenant command dashboard, profile setups, manager allocations, personnel tracking, CSV timesheets export."),
      users: t("Tenant Owner / SaaS Enterprise Admin"),
      access: t("TENANT COMMAND TIER 7")
    },
    {
      name: t("Organization Admin"),
      icon: Building2,
      duties: t("Managing organization profiles, site GPS geofences mapping, and registering vendor contracts."),
      users: t("Corporate Operations Manager / Org Admin"),
      access: t("ORG CONFIG TIER 6")
    },
    {
      name: t("HR Admin"),
      icon: FileSpreadsheet,
      duties: t("Verifying personnel credentials (blood group, Govt ID verification, skill types), and exporting shift compliance matrices."),
      users: t("HR & Compliance Managers"),
      access: t("HR COMPLIANCE TIER 5")
    },
    {
      name: t("Workforce Supervisor"),
      icon: Users,
      duties: t("Creating shift schedules, roster allocations, manual override check-ins, and auditing active site counts."),
      users: t("Site Supervisors / Field Overseers"),
      access: t("SITE COMMAND TIER 4")
    },
    {
      name: t("Security Officer"),
      icon: Scan,
      duties: t("Gate kiosk monitors, face liveness reviews, active spoof alarm handling, and monitoring real-time scans."),
      users: t("Gate Security / On-site Enforcers"),
      access: t("GATE CONTROL TIER 3")
    },
    {
      name: t("Vendor Manager"),
      icon: Briefcase,
      duties: t("Pre-registering sub-contractors and mapping workers under approved vendor contracts."),
      users: t("Third-Party Supplier Admins"),
      access: t("VENDOR SCOPE TIER 2")
    },
    {
      name: t("Contractor / Worker"),
      icon: UserCheck,
      duties: t("Scanning geofenced kiosks, tracking schedules, and viewing IndexedDB sync logs cards."),
      users: t("Sub-Contractors / Permanent Field Workers"),
      access: t("TRACKING TIER 1")
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
          {t('04 // SECURITY PARADIGMS')}
        </h2>
        <h3 className="text-4xl md:text-5xl font-black font-papyrus">
          {t('9-Tier Role-Based Access Matrix')}
        </h3>
        <p className="text-text-muted text-lg font-light leading-relaxed">
          {t('FaceShield EdgeAI guarantees a zero-trust architecture. Different organizational personas log into strictly custom-tailored command suites.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">

        {/* Left Side Role Selector Buttons */}
        <div className="lg:col-span-5 space-y-2">
          {roles.map((r, idx) => {
            const Icon = r.icon;
            const isActive = activeRole === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveRole(idx)}
                className={`w-full flex items-center justify-between p-4.5 rounded-2xl border text-left transition-all ${isActive
                  ? 'bg-brand-900/50 border-brand-500 text-text-primary shadow-[0_0_20px_rgba(13,255,0,0.15)] font-bold'
                  : 'bg-bg-primary/40 border-border-primary/10 text-text-muted hover:border-brand-500/20 hover:text-text-secondary'
                  } cursor-pointer`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-400' : 'text-text-muted'}`} />
                  <span className="font-mono text-sm tracking-wide">{r.name}</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-brand-950/80 px-2 py-0.5 rounded border border-brand-500/10">
                  Lvl {9 - idx}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Side Info Display Panel */}
        <div className="lg:col-span-7 bg-bg-primary border border-brand-500/25 p-8 rounded-3xl text-left relative min-h-[340px] flex flex-col justify-between overflow-hidden shadow-[0_0_30px_rgba(13,255,0,0.1)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

          {(() => {
            const currentProfile = roles.at(activeRole) || roles.at(0) || { icon: ShieldCheck, name: "Worker", access: "TRACKING TIER 1", duties: "", users: "" };
            const Icon = currentProfile.icon;
            return (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-border-primary/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-8 h-8 text-brand-400" />
                    <h4 className="text-2xl font-bold font-papyrus text-text-primary">
                      {t('{{name}} Command Profile', { name: currentProfile.name })}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold bg-brand-950 border border-brand-500/30 px-3 py-1 rounded-lg text-brand-400 uppercase tracking-wider">
                    {currentProfile.access}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-brand-400 font-bold block uppercase tracking-wider mb-1.5">
                      {t('CORE RESPONSIBILITIES')}
                    </span>
                    <p className="text-text-secondary text-sm leading-relaxed font-light">
                      {currentProfile.duties}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-brand-400 font-bold block uppercase tracking-wider mb-1.5">
                      {t('AUTHORIZED USERS IN DOMAIN')}
                    </span>
                    <p className="text-text-muted text-xs font-mono">
                      {currentProfile.users}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="border-t border-border-primary/10 pt-6 mt-6 flex justify-between items-center text-[10px] font-mono text-text-muted">
            <span>{t('CRYPTO ENVELOPE: ENABLED')}</span>
            <span>{t('TOKEN EXPIRY: 12 HOURS')}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * Animated High-Tech Live System CLI Logs Terminal
 */
function CommandLineTerminal({ personnel }: { personnel: string[] }) {
  const { t } = useTranslation();

  const getMockPhrases = () => [
    t("synced local queue database - 0 conflicts reported"),
    t("updated geofence coordinates for Yard Sector Omega"),
    t("processed high-accuracy biometric mesh match (99.98% confidence)"),
    t("completed daily site check-in credentials signature"),
    t("raised temporary override token: authorized by Super Admin"),
    t("analyzed crew fatigue metrics - all operators safe"),
    t("pushed 12 offline transactions to central NestJS API Gateway"),
    t("executed secure database backup to PostgreSQL vault"),
    t("initialized 3D landmark mesh scan"),
    t("cleared compliance checklists for upcoming morning shifts")
  ];

  const [logs, setLogs] = useState<string[]>(() => {
    return Array.from({ length: 6 }).map(() => {
      const time = new Date().toLocaleTimeString();
      const op = personnel.at(Math.floor(Math.random() * personnel.length)) || personnel.at(0) || "";
      const phrases = getMockPhrases();
      const phrase = phrases.at(Math.floor(Math.random() * phrases.length)) || phrases.at(0) || "";
      return `[${time}] [OP: ${op.toUpperCase()}] ${phrase}`;
    });
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic feed simulation loop
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const op = personnel.at(Math.floor(Math.random() * personnel.length)) || personnel.at(0) || "";
      const phrases = getMockPhrases();
      const phrase = phrases.at(Math.floor(Math.random() * phrases.length)) || phrases.at(0) || "";
      const newLog = `[${time}] [OP: ${op.toUpperCase()}] ${phrase}`;

      setLogs((prev) => {
        const next = [...prev, newLog];
        if (next.length > 8) next.shift(); // Keep only last 8 logs
        return next;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [personnel, t]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black/90 border border-brand-500/25 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(13,255,0,0.25)] text-left relative font-mono text-xs">

      {/* Terminal Title Bar */}
      <div className="bg-bg-secondary px-6 py-3.5 border-b border-brand-500/15 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4.5 h-4.5 text-brand-400" />
          <span className="font-bold text-text-secondary uppercase tracking-widest text-[10px]">
            {t('FaceShield EdgeAI-Core-Logger.sh')}
          </span>
        </div>
        <div className="flex space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-600/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-brand-600/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
        </div>
      </div>

      {/* Terminal Output Terminal */}
      <div
        ref={scrollRef}
        className="p-6 min-h-[300px] max-h-[320px] overflow-y-auto space-y-3 bg-[radial-gradient(ellipse_at_bottom,rgba(51,0,0,0.2),transparent)] text-brand-300 scrollbar-thin scrollbar-thumb-brand-900 scrollbar-track-transparent"
      >
        <div className="text-[10px] text-text-muted opacity-60 mb-2">
          {t('FaceShield EdgeAI CLI Initialized. Encrypted Secure Tunnel Connected.')}
        </div>

        {logs.map((log, idx) => (
          <div key={idx} className="flex items-start space-x-2 leading-relaxed tracking-wide">
            <span className="text-brand-500 select-none">&gt;&gt;</span>
            <span className="break-all">{log}</span>
          </div>
        ))}

        {/* Active Typing Blinking Cursor */}
        <div className="flex items-center space-x-2 pt-1">
          <span className="text-brand-500">&gt;&gt;</span>
          <span className="w-2.5 h-4 bg-brand-500 animate-[blink_1.2s_infinite]" />
        </div>
      </div>

      {/* Bottom telemetry line */}
      <div className="bg-brand-950/80 px-6 py-2.5 border-t border-brand-500/10 flex justify-between items-center text-[9px] text-text-muted">
        <span>{t('ACTIVE LOGS CHANNELS: #8')}</span>
        <span>{t('SECURITY ENVELOPE: SHA-256 SIGNED')}</span>
      </div>
    </div>
  );
}

/**
 * High-Fidelity 3D Neural Face Scanner Simulation Widget
 */
function FaceScannerSimulation() {
  const { t } = useTranslation();
  const [matchStatus, setMatchStatus] = useState("SCANNING");
  const [matchPct, setMatchPct] = useState(0);

  useEffect(() => {
    const cycle = setInterval(() => {
      setMatchStatus("SCANNING");
      setMatchPct(0);

      // Simulation steps
      setTimeout(() => {
        setMatchPct(48);
      }, 800);

      setTimeout(() => {
        setMatchPct(99.98);
        setMatchStatus("MATCH APPROVED");
      }, 1600);

    }, 5000);

    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="bg-black border border-brand-500/25 p-6 rounded-3xl relative overflow-hidden shadow-[0_0_40px_rgba(13,255,0,0.15)] flex flex-col justify-between text-left min-h-[380px]">

      {/* Scanner laser overlay lines */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,255,0,0.03)_1px,transparent_1px),linear-gradient(rgba(13,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* SCANNING ACTIVE INDICATOR BAR */}
      {matchStatus === "SCANNING" && (
        <motion.div
          animate={{ y: [0, 320, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="absolute left-0 w-full h-0.5 bg-brand-500/80 z-20 shadow-[0_0_12px_rgba(13,255,0,1)]"
        />
      )}

      {/* Frame Headers */}
      <div className="flex justify-between items-center z-10 border-b border-brand-900/60 pb-3">
        <div className="flex items-center space-x-2">
          <Scan className="w-4 h-4 text-brand-500" />
          <span className="font-mono text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            {t('Neural Scanner Node')}
          </span>
        </div>
        <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border ${matchStatus === "SCANNING"
          ? 'bg-brand-950 text-brand-400 border-brand-500/30 animate-pulse'
          : 'bg-success/20 text-success border-success/40'
          }`}>
          {matchStatus === "SCANNING" ? t("SCANNING") : t("MATCH APPROVED")}
        </span>
      </div>

      {/* Face Scanner Wireframe Avatar */}
      <div className="my-6 relative flex items-center justify-center h-44">
        {/* Holographic face shape */}
        <div className="relative">
          <Fingerprint className={`w-28 h-28 transition-colors duration-500 ${matchStatus === "SCANNING" ? 'text-brand-500/40 animate-pulse' : 'text-brand-400/90'
            }`} />

          {/* Tracking landmarks boxes */}
          <div className="absolute top-2 left-4 w-3 h-3 border-t border-l border-brand-400" />
          <div className="absolute top-2 right-4 w-3 h-3 border-t border-r border-brand-400" />
          <div className="absolute bottom-2 left-4 w-3 h-3 border-b border-l border-brand-400" />
          <div className="absolute bottom-2 right-4 w-3 h-3 border-b border-r border-brand-400" />
        </div>

        {/* Dynamic scan scores */}
        <div className="absolute bottom-0 left-4 font-mono text-[9px] text-text-muted space-y-0.5 bg-black/80 p-2 rounded border border-brand-900/40">
          <div>{t('EYE DISTANCE: 0.62')}</div>
          <div>{t('NASAL ANGLE: 12.4°')}</div>
          <div>{t('JAW WIDTH: 0.88')}</div>
        </div>

        <div className="absolute top-0 right-4 font-mono text-[9px] text-text-muted bg-black/80 p-2 rounded border border-brand-900/40">
          <div>{t('MESH KEYPOINTS: 468')}</div>
          <div>{t('RESOLUTION: 3D GRID')}</div>
        </div>
      </div>

      {/* Matching result metrics */}
      <div className="z-10 bg-brand-950/60 p-4.5 rounded-2xl border border-brand-500/10 space-y-3 font-mono">
        <div className="flex justify-between items-center text-xs">
          <span className="text-text-muted">{t('NEURAL MATCH PROBABILITY')}</span>
          <span className="text-brand-300 font-bold">{matchPct > 0 ? `${matchPct}%` : t('CALCULATING...')}</span>
        </div>
        <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-brand-900/60">
          <div
            className="bg-brand-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${matchPct}%` }}
          />
        </div>

        {matchStatus !== "SCANNING" && (
          <div className="flex items-center space-x-2 text-[10px] text-brand-300">
            <Check className="w-3.5 h-3.5" />
            <span>{t('OPERATOR: GRISH // VERIFICATION COMPLETE')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Spatial Geofence Simulator Widget
 */
function GeofenceSimulator() {
  const { t } = useTranslation();
  const [activeZone, setActiveZone] = useState("HAZARDOUS YARD BETA");
  const [status, setStatus] = useState("SECURE");

  useEffect(() => {
    const sequence = setInterval(() => {
      setStatus("BREACH ALERT!");
      setActiveZone("RESTRICTED VAULT 4");

      setTimeout(() => {
        setStatus("SECURE");
        setActiveZone("HAZARDOUS YARD BETA");
      }, 2500);

    }, 6000);

    return () => clearInterval(sequence);
  }, []);

  return (
    <div className="bg-black border border-brand-500/25 p-6 rounded-3xl relative overflow-hidden shadow-[0_0_40px_rgba(13,255,0,0.15)] flex flex-col justify-between text-left min-h-[380px] font-mono text-xs">

      {/* Section Header */}
      <div className="flex justify-between items-center pb-3 border-b border-brand-900/60">
        <div className="flex items-center space-x-2">
          <Map className="w-4.5 h-4.5 text-brand-500" />
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            {t('Spatial Radar Monitor')}
          </span>
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${status === "SECURE"
          ? 'bg-success/20 text-success border-success/40'
          : 'bg-brand-950 text-brand-400 border-brand-500 animate-flash-red'
          }`}>
          {status === "SECURE" ? t("SECURE") : t("BREACH ALERT!")}
        </span>
      </div>

      {/* Simulated Map Area */}
      <div className="my-6 h-40 bg-bg-secondary/40 border border-brand-900 rounded-2xl relative flex items-center justify-center overflow-hidden">
        {/* Concentric rings */}
        <div className="absolute border border-brand-500/10 rounded-full w-48 h-48 animate-pulse" />
        <div className="absolute border border-brand-500/5 rounded-full w-32 h-32" />
        <div className="absolute border border-brand-500/15 rounded-full w-16 h-16" />

        {/* Crosshair grids */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-brand-500/5" />
        <div className="absolute left-0 right-0 h-0.5 bg-brand-500/5" />

        {/* Warning zone shape */}
        <div className={`absolute border border-dashed rounded-xl w-36 h-28 transition-colors duration-300 ${status === "SECURE" ? 'border-brand-500/15 bg-brand-500/[0.02]' : 'border-brand-500/60 bg-brand-500/[0.08]'
          }`} />

        {/* Floating operator blips */}
        <div className="absolute top-10 left-20">
          <span className="flex w-2.5 h-2.5 bg-success rounded-full" />
          <span className="text-[8px] text-text-muted absolute mt-1">{t('GIRIJESH')}</span>
        </div>

        <div className="absolute bottom-12 right-24">
          <span className="flex w-2.5 h-2.5 bg-success rounded-full" />
          <span className="text-[8px] text-text-muted absolute mt-1">{t('DEVICHARAN')}</span>
        </div>

        <div className={`absolute transition-all duration-1000 ${status === "SECURE" ? 'top-16 right-20' : 'top-6 right-28'
          }`}>
          <span className={`flex w-2.5 h-2.5 rounded-full ${status === "SECURE" ? 'bg-success' : 'bg-brand-500 animate-ping'}`} />
          <span className={`text-[8px] absolute mt-1 font-bold ${status === "SECURE" ? 'text-text-muted' : 'text-brand-400'}`}>
            {t('HARIVARSHAN')}
          </span>
        </div>
      </div>

      {/* Simulated zone dashboard details */}
      <div className="bg-brand-950/60 p-4.5 rounded-2xl border border-brand-500/10 space-y-2">
        <div className="flex justify-between">
          <span className="text-text-muted">{t('ACTIVE ZONE PROBED')}</span>
          <span className="text-text-secondary font-bold">{t(activeZone)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">{t('TARGET NODE COORD')}</span>
          <span className="text-brand-300">41.8781° N, 87.6298° W</span>
        </div>
        <div className="flex justify-between border-t border-brand-900/60 pt-2 text-[10px] text-text-muted">
          <span>{t('DEVICES CONNECTED: 124')}</span>
          <span>{t('ACCURACY RATIO: +/- 1.2M')}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Offline Cache Queue Simulator Widget
 */
function OfflineQueueSimulator() {
  const { t } = useTranslation();
  const [offlineQueue, setOfflineQueue] = useState<number>(4);
  const [syncing, setSyncing] = useState(false);

  const performManualSync = () => {
    if (offlineQueue === 0 || syncing) return;
    setSyncing(true);

    // Simulate batch sync uploads
    const interval = setInterval(() => {
      setOfflineQueue((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSyncing(false);
          return 0;
        }
        return prev - 1;
      });
    }, 800);
  };

  // Reset simulation periodically
  useEffect(() => {
    if (offlineQueue === 0 && !syncing) {
      const reset = setTimeout(() => {
        setOfflineQueue(5);
      }, 5000);
      return () => clearTimeout(reset);
    }
  }, [offlineQueue, syncing]);

  return (
    <div className="bg-black border border-brand-500/25 p-6 rounded-3xl relative overflow-hidden shadow-[0_0_40px_rgba(13,255,0,0.15)] flex flex-col justify-between text-left min-h-[380px] font-mono text-xs">

      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-brand-900/60">
        <div className="flex items-center space-x-2">
          <Database className="w-4.5 h-4.5 text-brand-500" />
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            {t('IndexedDB Local Vault')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${offlineQueue > 0 ? 'bg-warning animate-pulse' : 'bg-success'}`} />
          <span className="text-[9px] uppercase">{offlineQueue > 0 ? t('QUEUED DATA') : t('FULLY SYNCED')}</span>
        </div>
      </div>

      {/* Queue Progress visualization */}
      <div className="my-6 space-y-4">
        <span className="text-[10px] text-text-muted uppercase block">{t('PENDING OFFLINE SHIFT LOGS')}</span>

        {offlineQueue > 0 ? (
          <div className="space-y-2">
            {Array.from({ length: offlineQueue }).map((_, i) => (
              <div key={i} className="bg-bg-secondary/40 border border-brand-500/10 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock className="w-3.5 h-3.5 text-warning shrink-0" />
                  <span className="text-[10px] text-text-secondary">{t('AES_GCM_TRANSACTION_#0{{count}}', { count: i + 1 })}</span>
                </div>
                <span className="text-[9px] text-warning bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                  {t('QUEUED')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 border border-dashed border-success/30 rounded-2xl flex flex-col justify-center items-center text-center p-4">
            <CheckCircle2 className="w-10 h-10 text-success mb-2" />
            <span className="text-success font-bold">{t('ALL OFFLINE RECORDS TRANSMITTED')}</span>
            <span className="text-[9px] text-text-muted mt-1">{t('IndexedDB buffer is empty. Zero database drift.')}</span>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="space-y-3 z-10">
        <button
          onClick={performManualSync}
          disabled={offlineQueue === 0 || syncing}
          className={`w-full flex items-center justify-center space-x-2 p-3.5 rounded-xl font-bold transition-all ${offlineQueue === 0 || syncing
            ? 'bg-brand-950/60 border border-brand-900 text-text-disabled cursor-not-allowed'
            : 'bg-brand-600 hover:bg-brand-500 text-text-primary border border-brand-500/30 hover:border-brand-500 shadow-md cursor-pointer'
            }`}
        >
          {syncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{t('SYNCHRONIZING SECURE TUNNELS...')}</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>{t('FORCE CLOUD SYNCHRONIZATION ({{count}})', { count: offlineQueue })}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
 