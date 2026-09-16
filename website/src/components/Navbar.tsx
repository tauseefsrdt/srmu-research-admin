import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Bookmark,
  Search,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

interface NavbarProps {
  onSearchToggle?: () => void;
}

function Navbar({ onSearchToggle }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Research Publications", path: "/research", icon: Bookmark },
    { name: "Patents", path: "/patents", icon: FileText },
    { name: "Books & Chapters", path: "/books", icon: BookOpen },
    { name: "About", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onSearchToggle?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchToggle]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`site-nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group shrink-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-md border border-slate-200/90 shadow-sm p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <img src="/Images/IMG-20210904-WA0042.jpg" alt="SRMU Emblem" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col font-sans font-black uppercase text-[#0B2545] tracking-wide leading-[1.1]">
            <span className="text-[14px] sm:text-[15px] font-extrabold tracking-wide group-hover:text-[#0A4A8F] transition-colors">
              SRMU RESEARCH
            </span>
            <span className="text-[13px] sm:text-[14px] font-extrabold tracking-wider text-[#0A4A8F]">
              &amp; CONSULTANCY
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="desktop-nav">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${active ? "active" : ""}`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="desktop-actions">
          {onSearchToggle && (
            <button 
              onClick={onSearchToggle} 
              className="nav-search"
              aria-label="Search research archive"
            >
              <Search size={14} color="currentColor" />
              <span>Search…</span>
              <kbd style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                padding: '2px 5px',
                borderRadius: 4,
                background: 'rgba(10, 74, 143, 0.08)',
                color: 'var(--color-deep-teal)',
                border: '1px solid rgba(10, 74, 143, 0.14)',
                marginLeft: 4,
              }}>⌘K</kbd>
            </button>
          )}
          <Link to="/research" className="btn-primary nav-cta inline-flex items-center gap-1.5 group">
            <span>Explore research</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/5 hover:bg-[#0A4A8F]/10 text-slate-700 hover:text-[#0A4A8F] border border-slate-200 text-xs font-semibold transition-all"
            title="Open Admin Portal"
          >
            <span>Admin</span>
          </a>
        </div>

        {/* Mobile toggle */}
        <button 
          className="mobile-toggle" 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="mobile-menu">
          {onSearchToggle && (
            <button 
              onClick={() => { setIsOpen(false); onSearchToggle(); }} 
              className="nav-search"
              style={{ width: '100%', marginBottom: 12, justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Search size={14} color="currentColor" />
                <span>Search archive…</span>
              </div>
              <kbd style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                padding: '2px 6px',
                borderRadius: 4,
                background: 'rgba(10, 74, 143, 0.08)',
              }}>⌘K</kbd>
            </button>
          )}

          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`mobile-link ${active ? "active" : ""}`}
              >
                {link.name}
              </Link>
            );
          })}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-card-mint)' }}>
            <Link
              to="/research"
              onClick={() => setIsOpen(false)}
              className="btn-primary"
              style={{ display: 'flex', justifyContent: 'center', fontSize: 14 }}
            >
              Explore research
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

