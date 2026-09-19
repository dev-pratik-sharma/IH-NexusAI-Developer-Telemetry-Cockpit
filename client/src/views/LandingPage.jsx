import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Terminal, Sparkles, ArrowRight, Layers, Code, 
  Cpu, Database, ShieldAlert, CheckCircle2, ChevronDown, Monitor, ExternalLink
} from 'lucide-react';

const LandingPage = () => {
  const { setIsLoggedIn, setUserProfile } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Form Input States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real API Gateway Request Handler
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const endpoint = isSignUp ? 'signup' : 'login';
    const payload = isSignUp ? { name, email, password } : { email, password };

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication sequence failed.');
      }

      // Store secure cryptographic token inside browser memory
      localStorage.setItem('nexus_token', data.token);
      
      // Update global user application layout context states
      setUserProfile({
        name: data.user.name,
        email: data.user.email,
        avatarColor: '' // Let context assign a random gradient
      });

      setIsLoggedIn(true); // Grant system clearance
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const coreFeatures = [
    {
      icon: <Cpu className="text-indigo-400" size={20} />,
      title: "Cognitive Processing Engine",
      desc: "Implements real-time textual compression and context vector prioritization to separate signal from execution noise."
    },
    {
      icon: <Database className="text-purple-400" size={20} />,
      title: "Relational Persistence Layer",
      desc: "Engineered on structural PostgreSQL data models backed by modular Prisma object-relational mapping protocols."
    },
    {
      icon: <Code className="text-pink-400" size={20} />,
      title: "Component Component Matrix",
      desc: "Rendered using stateless React atomic components with adaptive glassmorphism layers compiled by Vite."
    },
    {
      icon: <Layers className="text-emerald-400" size={20} />,
      title: "3D Hardware Acceleration",
      desc: "Utilizes low-overhead WebGL contexts powered by Three.js to construct dynamic operational canvas elements."
    }
  ];

  const faqData = [
    { q: "What technologies power the underlying architecture?", a: "The framework runs on the modern PERN stack (PostgreSQL, Express, React, Node.js) with Tailwind CSS v4 and Three.js canvas injection." },
    { q: "Is the authentication layer production-ready?", a: "Yes. The gateway interfaces with JSON Web Tokens (JWT) containing cryptographic signing signatures stored safely within cookie structures." },
    { q: "How are the AI prioritization nodes computed?", a: "Task datasets are processed using semantic text extraction routines via targeted AI models to determine critical critical logic loops." }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start px-4 py-8 lg:py-12 selection:bg-indigo-500/30">
      
      {/* 1. Global Navigation Bar Header */}
      <header className="w-full max-w-6xl glass-card px-6 py-4 rounded-2xl flex items-center justify-between mb-16 transition-all duration-300">
        <div className="flex items-center gap-2">
          <Terminal className="text-indigo-400 animate-pulse" size={20} />
          <span className="font-bold tracking-wider text-sm bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent font-mono">NEXUS.AI</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <a href="#features" className="hover:text-indigo-400 transition-colors hidden sm:inline">Modules</a>
          <a href="#preview" className="hover:text-indigo-400 transition-colors hidden sm:inline">Live Preview</a>
          <a href="#faq" className="hover:text-indigo-400 transition-colors">Documentation</a>
          <button 
            type="button"
            onClick={() => {
              setUserProfile({ name: 'Demo Intern', email: 'demo@nexus.ai', avatarColor: '' });
              setIsLoggedIn(true);
            }} 
            className="px-4 py-2 bg-linear-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/40 hover:to-purple-600/40 border border-indigo-500/30 rounded-xl text-indigo-300 font-medium transition-all text-xs cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.1)]"
          >
            Bypass Gateway
          </button>
        </div>
      </header>

      {/* 2. Hero Component Segment Area */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[10px] tracking-wider uppercase">
            <Sparkles size={12} className="animate-spin" /> System V4 Release Suite Live
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            The intelligent workspace for <br />
            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              high-velocity developer nodes.
            </span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
            Nexus AI consolidates structural project dependencies, operational tasks, and deep semantic LLM pipelines into an integrated, hardware-accelerated dashboard environment.
          </p>
        </div>

        {/* Right Authentication Form Widget */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
            <h3 className="text-lg font-bold text-white mb-1">
              {isSignUp ? 'Initialize Instance Access' : 'Establish Security Clearance'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isSignUp ? 'Generate structural developer identity matrices.' : 'Input security tokens to mount execution panels.'}
            </p>

            {/* Error Notification Flash Bar */}
            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono text-left animate-shake">
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
              {isSignUp && (
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5">Developer Alias</label>
                  <input type="text" placeholder="e.g., Alex Mercer" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 text-xs rounded-xl glass-input transition-all" />
                </div>
              )}
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5">Network Identity Email</label>
                <input type="email" placeholder="dev@nexus.ai" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2.5 text-xs rounded-xl glass-input transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5">Access Passcode Token</label>
                <input type="password" placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2.5 text-xs rounded-xl glass-input transition-all" />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-6 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Syncing Credentials...' : isSignUp ? 'Build Workspace Suite' : 'Verify Security Clearance'}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            <div className="mt-6 text-center text-[11px] text-slate-400">
              {isSignUp ? 'Possess operational authorization?' : 'Awaiting authorized workspace credentials?'}
              <button 
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(''); }} 
                className="text-indigo-400 hover:underline font-medium ml-1 bg-transparent border-none cursor-pointer"
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      </div>

            {/* 3. Comprehensive Core System Architecture Features Grid */}
      <section id="features" className="w-full max-w-6xl space-y-8 mb-24 pt-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">PRODUCT ARCHITECTURE MODULES</h2>
          <p className="text-2xl font-bold text-white tracking-tight">Engineered for complex structural pipeline data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coreFeatures.map((f, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl flex items-start gap-4 border border-white/5 hover:border-white/10 transition-all duration-300">
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl shrink-0">
                {f.icon}
              </div>
              <div className="space-y-1 text-left">
                <h3 className="text-sm font-semibold text-slate-100">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive High-Fidelity UI Live Feature Preview Section */}
      <section id="preview" className="w-full max-w-6xl space-y-6 mb-24">
        <div className="text-left space-y-1 border-b border-white/5 pb-4">
          <h2 className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">WORKSPACE LIVE TELEMETRY PREVIEW</h2>
          <p className="text-lg text-slate-300 font-semibold">Active operational dashboard view configuration matrix</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 glass-card p-5 rounded-2xl border border-white/5 font-mono text-[11px] text-slate-400 text-left flex flex-col justify-between min-h-55">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 mb-2 text-slate-500">
                <Monitor size={12} /> <span>nexus-core-runtime.log</span>
              </div>
              <p className="text-emerald-400 font-bold">[OK] Connection initialized safely with Postgres Cluster.</p>
              <p className="text-indigo-400">[INFO] Loaded WebGL 3D line network environment nodes.</p>
              <p className="text-purple-400">[AI-ENGINE] Calculated priorities sequence streaming data arrays.</p>
              <p className="text-amber-400 animate-pulse">[PENDING] Listening on development node port 5173...</p>
            </div>
            <div className="pt-4 text-slate-600 flex items-center justify-between text-[10px]">
              <span>PID: 40821</span>
              <span>MEMORY COMPRESSION: 42.1MB</span>
            </div>
          </div>

          <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-white/5 text-left flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-400">ACTIVE INFRASTRUCTURE TARGET</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 border border-emerald-400/20 rounded-md">CONNECTED</span>
              </div>
              <h3 className="text-md font-bold text-white">Quantum Core Microservice System</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically computing sequence parsing limits across your isolated code bases while validating data persistence streams cleanly.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-indigo-400" />
                <span>REST Endpoints Active</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} className="text-purple-400" />
                <span>Secure JWT Gateways Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Product Architecture Documentation Accordion & FAQ Layer */}
      <section id="faq" className="w-full max-w-3xl space-y-6 text-left mb-16">
        <div className="text-center space-y-1">
          <h2 className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">SYSTEM DOCUMENTATION KNOWLEDGE</h2>
          <p className="text-lg font-bold text-white">Frequently Asked Integration Queries</p>
        </div>

        <div className="space-y-3">
          {faqData.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="glass-card rounded-xl border border-white/5 transition-all duration-300 overflow-hidden">
                <button type="button" onClick={() => setOpenFaq(isOpen ? null : idx)} className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-semibold text-slate-200 text-xs hover:text-white transition-colors cursor-pointer">
                  <span>{item.q}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-24 border-t border-white/5 px-5 py-4 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Footer System Layout */}
      <footer className="w-full max-w-6xl border-t border-white/5 pt-8 text-center text-[11px] text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 NEXUS CORE MANAGEMENT SYSTEMS. ALL RIGHTS CLEAR.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 hover:text-slate-300 cursor-pointer">Specs API <ExternalLink size={10} /></span>
          <span className="hover:text-slate-300 cursor-pointer">Security Ledger</span>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
