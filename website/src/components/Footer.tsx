import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, FileText, BookOpen, Info } from 'lucide-react';

function Footer() {
  const exploreLinks = [
    { label: 'Research Publications', to: '/research', icon: Bookmark },
    { label: 'Patents', to: '/patents', icon: FileText },
    { label: 'Books & Chapters', to: '/books', icon: BookOpen },
    { label: 'About', to: '/about', icon: Info },
  ];

  const allInstitutes = [
    { code: 'IoT', name: 'Institute of Technology', to: '/department/institute-of-technology' },
    { code: 'IBST', name: 'Institute of Biosciences and Technology', to: '/department/institute-of-biosciences-and-technology' },
    { code: 'IMCE', name: 'Institute of Management, Commerce and Economics', to: '/department/institute-of-management-commerce-and-economics' },
    { code: 'ILS', name: 'Institute of Legal Studies', to: '/department/institute-of-legal-studies' },
    { code: 'IoP', name: 'Institute of Pharmacy', to: '/department/institute-of-pharmacy' },
    { code: 'INSH', name: 'Institute of Natural Sciences and Humanities', to: '/department/institute-of-natural-sciences-and-humanities' },
    { code: 'IER', name: 'Institute of Education and Research', to: '/department/institute-of-education-and-research' },
    { code: 'IMS', name: 'Institute of Media Studies', to: '/department/institute-of-media-studies' },
    { code: 'IAST', name: 'Institute of Agricultural Sciences and Technology', to: '/department/institute-of-agricultural-sciences-and-technology' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#0B1E3B] via-[#07162C] to-[#040E1D] text-white mt-auto overflow-hidden border-t-4 border-[#FFB703]">
      {/* Background Decorative Grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Subtle Glows */}
      <div className="absolute -top-24 left-1/3 w-80 h-80 rounded-full bg-[#0A4A8F]/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-[#FFB703]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-6 pt-14 pb-10 relative z-10">

        {/* Main Grid: 3 Clean, Well-Proportioned Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-10">

          {/* 1. Brand / Overview (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              {/* Official SRMU Logo Box & Title */}
              <Link to="/" className="inline-flex items-center gap-3.5 no-underline group mb-4">
                <div className="w-12 h-12 rounded-md bg-white border border-white/20 shadow-md p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <img src="/Images/IMG-20210904-WA0042.jpg" alt="SRMU Emblem" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col font-sans font-black uppercase tracking-wide leading-[1.1]">
                  <span className="text-[16px] sm:text-[17px] font-extrabold text-white tracking-wide">
                    SRMU RESEARCH
                  </span>
                  <span className="text-[14px] sm:text-[15px] font-extrabold text-[#FFB703] tracking-wider">
                    &amp; CONSULTANCY
                  </span>
                </div>
              </Link>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mb-5">
                Shri Ramswaroop Memorial University Research &amp; Consultancy Cell, showcasing high impact research publications, patents, books and book chapters.
              </p>
            </div>


          </div>

          {/* 2. Explore Links (Col Span 3) */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-1 border-b border-white/10">
              <span className="w-1.5 h-3.5 bg-[#FFB703] rounded-full" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFB703] m-0">
                Explore
              </h4>
            </div>

            <div className="flex flex-col gap-3">
              {exploreLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-xs sm:text-sm text-slate-200 hover:text-[#FFB703] hover:translate-x-1.5 transition-all duration-200 inline-flex items-center gap-2.5 group py-0.5"
                >
                  <ArrowRight size={13} className="text-[#FFB703] group-hover:translate-x-0.5 transition-transform shrink-0" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Institutes Directory in a Clean 2-Column Subgrid (Col Span 5) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-1 border-b border-white/10">
              <span className="w-1.5 h-3.5 bg-[#FFB703] rounded-full" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFB703] m-0">
                Institutes
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs sm:text-[13px] text-slate-300">
              {allInstitutes.map((inst, idx) => (
                <Link
                  key={idx}
                  to={inst.to}
                  className="flex items-start gap-2 py-0.5 group text-inherit no-underline hover:translate-x-1 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703] mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="leading-snug group-hover:text-[#FFB703] transition-colors">
                    <strong className="text-white font-semibold">{inst.code}</strong> ({inst.name})
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>



      </div>
    </footer>
  );
}

export default Footer;
