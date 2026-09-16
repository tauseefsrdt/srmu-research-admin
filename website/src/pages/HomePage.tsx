import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Lightbulb,
  BookOpen,
  Users,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import MorphSlider from "../Effects/Morph-Slider";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchStats } from "../store/slices/statsSlice";
import { Stats } from "../types";

gsap.registerPlugin(ScrollTrigger);

const sliderItems = [
  {
    image: "Images/J1.png",
    title: "Research Environment",
    caption: "Research papers.",
  },
  {
    image: "Images/J2.png",
    title: "Biosciences",
    caption: "Research papers.",
  },
];

const patronsList = [
  {
    name: "Er. Pankaj Agarwal",
    role: "CHANCELLOR",
    image: "Images/pankaj-DsE5rnwQ.webp",
  },
  {
    name: "Er. Pooja Agarwal",
    role: "PRO CHANCELLOR",
    image: "Images/pooja_Agrawal.png",
  },
  {
    name: "Prof. (Dr.) Vijay Tiwari",
    role: "VICE CHANCELLOR",
    image: "Images/vijaytiwari-DtLhXa4L.webp",
  },
];

const coPatronsList = [
  {
    name: "Prof. (Dr.) Hemendra Sharma",
    role: "REGISTRAR",
    image: "Images/Hemendra-NSaxOOgS.webp",
  },
  {
    name: "Prof. (Dr.) Nabeel Ahmad",
    role: "DIRECTOR (RESEARCH)",
    image: "Images/Nabeel-Ahmad.jpeg",
  },
  {
    name: "Prof. (Dr.) Alkesh Agrawal",
    role: "DEPUTY DIRECTOR (RESEARCH)",
    image: "Images/Alkesh_Agrawal.webp",
  },
];

import { DEPARTMENTS_LIST } from "../data/departmentData";

const institutes = DEPARTMENTS_LIST.map((dept) => ({
  id: dept.id,
  src: dept.image,
  title: dept.title,
  text: dept.description,
  department: dept.departmentCountLabel,
}));

interface HomePageProps {
  onSearchOpen?: () => void;
}

function HomePage({ onSearchOpen }: HomePageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const patronsRef = useRef<HTMLDivElement>(null);
  const coPatronsRef = useRef<HTMLDivElement>(null);
  const institutesRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.stats);
  const [activeProfile] = useState("message");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Counter numerical values for GSAP counting animation
  const countRefs = useRef({
    indexed: 195,
    papers: 17,
    books: 68,
    researchers: 250,
  });

  const [displayCounts, setDisplayCounts] = useState({
    indexed: 195,
    papers: 17,
    books: 68,
    researchers: 250,
  });

  const profileData = [
    {
      key: "message",
      label: "R&C Cell Message",
      title: "Research & Consultancy Cell",
      designation: "R&C Cell",
      image: "Images/CEO-1.jpg",
      excerpt:
        "At Shri Ramswaroop Memorial University (SRMU) Barabanki, we believe that research and innovation are fundamental drivers of academic excellence, technological advancement, and societal progress.",
      fullContent: [
        <h1
          key="welcome"
          className="text-2xl font-bold text-charcoal-navy"
        >
          Welcomes you all!
        </h1>,
        "At Shri Ramswaroop Memorial University (SRMU) Barabanki, we believe that research and innovation are fundamental drivers of academic excellence, technological advancement, and societal progress. Our commitment is to cultivate a dynamic research ecosystem that empowers students, faculty members, and research scholars to transform ideas into impactful solutions.",
        "The University has established state-of-the-art research and innovation facilities, including the AI Center of Excellence, Virtual Instrumentation Laboratory, Cadence Design Laboratory, PCB design Lab, Centre of Excellence (EV Lab), and the Innovation & Incubation Hub, which provide a robust platform for experimentation, product development, entrepreneurship, and interdisciplinary research. These facilities enable our researchers to engage with emerging technologies and address real-world challenges through innovative approaches.",
        "A distinctive feature of SRMU's research framework is its emphasis on Experiment-Based Research. By integrating research-oriented projects into the learning process, we encourage researchers to develop critical thinking, problem-solving abilities, teamwork, and innovation skills. This approach bridges the gap between theoretical knowledge and practical application, preparing researchers to excel in both industry and academia.",
        "The R&C cell actively promotes quality publications, industry collaborations, intellectual property creation, and startup incubation. R&C cell continuously strives to strengthen partnerships with academic institutions, research organizations, government agencies, and industry leaders to create opportunities for knowledge exchange and collaborative innovative research.",
        "As we move forward in an era defined by rapid technological transformation, our focus remains on nurturing a culture of inquiry, creativity, ethical research practices, and entrepreneurial thinking. R&C Cell encourages research scholars and faculty members to explore new frontiers of knowledge and contribute meaningfully to national development and global progress.",
        "R&C Cell invites you to explore the diverse research opportunities available at SRMU, Barabanki and become part of a community dedicated to excellence, innovation, and lifelong learning.",
        "Together, let us create knowledge, inspire innovation, and shape a better future.",
        <h1
          key="research-cell"
          className="text-2xl font-bold text-charcoal-navy"
        >
          Research and Consultancy Cell
        </h1>,
        "Shri Ramswaroop Memorial University, Barabanki",
      ],
    },
  ];

  const activeProfileData =
    profileData.find((profile) => profile.key === activeProfile) ||
    profileData[0];

  /* ----------------------------------
     Data Loading
  ---------------------------------- */
  useEffect(() => {
    dispatch(fetchStats("2025-26"));
  }, [dispatch]);

  /* ----------------------------------
     Modal Escape Key
  ---------------------------------- */
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  /* ----------------------------------
     GSAP Animations Setup
  ---------------------------------- */
  useEffect(() => {
    if (loading || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setDisplayCounts({
        indexed: stats?.totalIndexed || 195,
        papers: stats?.totalPapers || 47,
        books: stats?.totalBooks || 68,
        researchers: stats?.totalResearchers || 310,
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Hero Entrance Animation
      const heroTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          gsap.set(
            ".hero-badge-reveal, .hero-title-reveal, .hero-message-reveal, .hero-slider-reveal",
            { clearProps: "all" }
          );
        },
      });

      heroTl
        .fromTo(
          ".hero-badge-reveal",
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.1 }
        )
        .fromTo(
          ".hero-title-reveal",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75 },
          "-=0.4"
        )
        .fromTo(
          ".hero-message-reveal",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75 },
          "-=0.45"
        )
        .fromTo(
          ".hero-slider-reveal",
          { scale: 0.94, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9 },
          "-=0.6"
        );

      // Stats Strip ScrollTrigger with Animated Number Counters
      if (statsRef.current) {
        const targetIndexed = stats?.totalIndexed || 195;
        const targetPapers = stats?.totalPapers || 47;
        const targetBooks = stats?.totalBooks || 68;
        const targetResearchers = targetIndexed + targetPapers + targetBooks || 310;

        ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              ".stat-item-reveal",
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                clearProps: "all",
              }
            );

            gsap.to(countRefs.current, {
              indexed: targetIndexed,
              papers: targetPapers,
              books: targetBooks,
              researchers: targetResearchers,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                setDisplayCounts({
                  indexed: Math.round(countRefs.current.indexed),
                  papers: Math.round(countRefs.current.papers),
                  books: Math.round(countRefs.current.books),
                  researchers: Math.round(countRefs.current.researchers),
                });
              },
            });
          },
        });
      }

      // Patrons ScrollTrigger
      if (patronsRef.current) {
        gsap.fromTo(
          ".patron-card-reveal",
          { y: 35, opacity: 0 },
          {
            scrollTrigger: {
              trigger: patronsRef.current,
              start: "top 80%",
              once: true,
            },
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }

      // Co Patrons ScrollTrigger
      if (coPatronsRef.current) {
        gsap.fromTo(
          ".copatron-card-reveal",
          { y: 35, opacity: 0 },
          {
            scrollTrigger: {
              trigger: coPatronsRef.current,
              start: "top 80%",
              once: true,
            },
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }

      // Institutes ScrollTrigger
      if (institutesRef.current) {
        gsap.fromTo(
          ".institute-card-reveal",
          { y: 35, opacity: 0 },
          {
            scrollTrigger: {
              trigger: institutesRef.current,
              start: "top 78%",
              once: true,
            },
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading, stats]);

  if (loading) {
    return (
      <div className="loading-state">
        <span className="loading-dot" />
        Loading the research archive
      </div>
    );
  }

  return (
    <div ref={containerRef} className="home-page-container relative overflow-x-hidden">

      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section ref={heroRef} className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 pb-12 sm:pt-14 sm:pb-16 relative">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column: Hero Copy & Message Card */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 md:p-9 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl hero-message-reveal">
            <div>
              {/* Eyebrow badge */}
              <div className="hero-badge-reveal inline-flex items-center gap-2 mb-3">
                <span className="w-5 h-[2px] bg-[#FFB703]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A4A8F]">
                  MESSAGE
                </span>
              </div>

              {/* Title */}
              <h1 className="hero-title-reveal font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-[#0F172A] leading-[1.16] mb-5">
                The Research and <br />
                Consultancy Cell <span className="text-[#0A4A8F]">(R&amp;C)</span>
              </h1>

              {/* Message Content */}
              <div className="space-y-4 text-slate-600 text-[14.5px] sm:text-[15px] leading-relaxed">
                <p>
                  At Shri Ramswaroop Memorial University (SRMU) Barabanki, we believe that research
                  and innovation are fundamental drivers of academic excellence, technological
                  advancement, and societal progress. Our commitment is to cultivate a dynamic research
                  ecosystem that empowers students, faculty members, and research scholars to transform
                  ideas into impactful solutions.
                </p>
                <p>
                  The University has established state-of-the-art research and innovation facilities, including
                  the AI Center of Excellence, Virtual Instrumentation Laboratory, Cadence Design
                  Laboratory, PCB design Lab, Centre of Excellence (EV Lab), and the Innovation &amp;
                  Incubation Hub, which provide a robust platform for experimentation, product development,
                  entrepreneurship, and interdisciplinary research.
                </p>
              </div>
            </div>

            {/* Bottom Action Area */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#0A4A8F] hover:bg-[#0C5CA8] text-white font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer hover:-translate-y-0.5"
              >
                <span>VIEW MORE</span>
                <ArrowRight size={14} />
              </button>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 hidden sm:inline-block">
                SRMU Research Cell
              </span>
            </div>
          </div>

          {/* Right Column: Morph Slider Card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl hero-slider-reveal">
            <div>
              {/* Eyebrow badge */}
              {/* <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-5 h-[2px] bg-[#FFB703]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A4A8F]">
                  HIGHLIGHTS
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] leading-snug mb-5">
                Research Environment &amp; <span className="text-[#0A4A8F]">Facilities</span>
              </h2> */}

              {/* Slider in framed container */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner bg-zinc-900 border border-slate-200/60">
                <MorphSlider
                  items={sliderItems}
                  transition="melt"
                  intensity={0.4}
                  aberration={0.35}
                  drift={0.55}
                  autoplay
                  overlayColor="rgba(10, 74, 143, 0.15)"
                  duration={0.9}
                  ease="power2.inOut"
                  scale={2.3}
                  autoplayDelay={4}
                  loop
                  radius={16}
                  fit="cover"
                  showCaptions
                  showControls
                  showIndicators
                />
              </div>
            </div>

            {/* Slider Bottom Action Area */}
            {/* <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0A4A8F] uppercase tracking-wider">
                Explore Innovations
              </span>
              <Link
                to="/research"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A4A8F] transition-colors"
              >
                <span>All Research</span>
                <ArrowRight size={13} />
              </Link>
            </div> */}
          </div>

        </div>
      </section>

      {/* ── STATISTICS STRIP (With Animated GSAP Counters & Interactive Navigation) ── */}
      <section ref={statsRef} className="max-w-[1240px] mx-auto px-4 sm:px-6 my-6 sm:my-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl shadow-xl border border-slate-200/90 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FFB703]/50 to-transparent" />

          {/* Stat 1: Research Publications */}
          <Link
            to="/research"
            className="stat-item-reveal flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50/90 hover:shadow-md border border-transparent hover:border-[#0A4A8F]/20 transition-all duration-300 group justify-center sm:justify-start cursor-pointer no-underline text-inherit"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#FFF8E7] to-[#FFE8B3] border border-[#FFB703]/30 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <FileText className="w-6 h-6 text-[#0A4A8F]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A4A8F] leading-tight tracking-tight group-hover:text-[#0C5CA8] transition-colors">
                {displayCounts.indexed}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mt-0.5 group-hover:text-[#0A4A8F] transition-colors flex items-center gap-1">
                Research Publications
                <ArrowRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#0A4A8F]" />
              </span>
            </div>
          </Link>

          {/* Stat 2: Patents */}
          <Link
            to="/patents"
            className="stat-item-reveal flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50/90 hover:shadow-md border border-transparent hover:border-[#0A4A8F]/20 transition-all duration-300 sm:border-l sm:border-slate-100 group justify-center sm:justify-start cursor-pointer no-underline text-inherit"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#FFF8E7] to-[#FFE8B3] border border-[#FFB703]/30 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Lightbulb className="w-6 h-6 text-[#FFB703]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A4A8F] leading-tight tracking-tight group-hover:text-[#0C5CA8] transition-colors">
                {displayCounts.papers}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mt-0.5 group-hover:text-[#0A4A8F] transition-colors flex items-center gap-1">
                Patents
                <ArrowRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#0A4A8F]" />
              </span>
            </div>
          </Link>

          {/* Stat 3: Books & Chapters */}
          <Link
            to="/books"
            className="stat-item-reveal flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50/90 hover:shadow-md border border-transparent hover:border-[#0A4A8F]/20 transition-all duration-300 sm:border-l sm:border-slate-100 group justify-center sm:justify-start cursor-pointer no-underline text-inherit"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#FFF8E7] to-[#FFE8B3] border border-[#FFB703]/30 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <BookOpen className="w-6 h-6 text-[#0A4A8F]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A4A8F] leading-tight tracking-tight group-hover:text-[#0C5CA8] transition-colors">
                {displayCounts.books}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mt-0.5 group-hover:text-[#0A4A8F] transition-colors flex items-center gap-1">
                Books &amp; Chapters
                <ArrowRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#0A4A8F]" />
              </span>
            </div>
          </Link>

          {/* Stat 4: Researchers */}
          <Link
            to="/research"
            className="stat-item-reveal flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50/90 hover:shadow-md border border-transparent hover:border-[#0A4A8F]/20 transition-all duration-300 sm:border-l sm:border-slate-100 group justify-center sm:justify-start cursor-pointer no-underline text-inherit"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#FFF8E7] to-[#FFE8B3] border border-[#FFB703]/30 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Users className="w-6 h-6 text-[#0A4A8F]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A4A8F] leading-tight tracking-tight group-hover:text-[#0C5CA8] transition-colors">
                {displayCounts.researchers}+
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mt-0.5 group-hover:text-[#0A4A8F] transition-colors flex items-center gap-1">
                Researchers
                <ArrowRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#0A4A8F]" />
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* ── PATRONS SECTION ──────────────────────────────── */}
      {/* <section ref={patronsRef} className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-6 relative">

       
        <div className="flex items-center justify-center gap-4 max-w-md mx-auto mb-10">
          <div className="flex-1 h-[1px] bg-slate-200" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Patrons
          </h2>
          <div className="flex-1 h-[1px] bg-slate-200" />
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {patronsList.map((patron) => (
            <div
              key={patron.name}
              className="patron-card-reveal group p-7 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-[#0A4A8F]/40 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden"
            >
              
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0A4A8F] via-[#FFB703] to-[#0A4A8F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

           
              <div className="relative mb-5 p-1.5 rounded-full bg-gradient-to-tr from-[#0A4A8F]/30 via-[#FFB703]/60 to-[#0A4A8F]/30 shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <img
                  src={patron.image}
                  alt={patron.name}
                  className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover border-2 border-white shadow-inner block"
                />
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0F172A] group-hover:text-[#0A4A8F] transition-colors mb-1.5 leading-snug">
                {patron.name}
              </h3>

              <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold">
                {patron.role}
              </p>
            </div>
          ))}
        </div>
      </section> */}

      {/* ── CO-PATRONS SECTION ───────────────────────────── */}
      {/* <section ref={coPatronsRef} className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 pb-16 relative">

      
        <div className="flex items-center justify-center gap-4 max-w-md mx-auto mb-10">
          <div className="flex-1 h-[1px] bg-slate-200" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Co Patrons
          </h2>
          <div className="flex-1 h-[1px] bg-slate-200" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {coPatronsList.map((coPatron) => (
            <div
              key={coPatron.name}
              className="copatron-card-reveal group p-7 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-[#0A4A8F]/40 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0A4A8F] via-[#FFB703] to-[#0A4A8F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative mb-5 p-1.5 rounded-full bg-gradient-to-tr from-[#0A4A8F]/30 via-[#FFB703]/60 to-[#0A4A8F]/30 shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <img
                  src={coPatron.image}
                  alt={coPatron.name}
                  className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover border-2 border-white shadow-inner block"
                />
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0F172A] group-hover:text-[#0A4A8F] transition-colors mb-1.5 leading-snug">
                {coPatron.name}
              </h3>

              <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold">
                {coPatron.role}
              </p>
            </div>
          ))}
        </div>
      </section> */}

      {/* ── INSTITUTES SECTION ("RECENT NOTES") ─────────── */}
      <section ref={institutesRef} className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-10 pb-20">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-3">


          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-[#FFB703] rounded-full hidden sm:block" />
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#0F172A] leading-tight font-bold">
              Institutes- Wise Research Data (2025-26)
            </h2>
          </div>


          <Link
            to="/departments"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0A4A8F] hover:text-[#0C5CA8] transition-colors shrink-0 group"
          >
            <span>View all papers</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Institute Cards Grid (3x3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutes.map((card) => (
            <div key={card.title} className="institute-card-reveal">
              <Link
                to={`/department/${card.id}`}
                className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-[#0A4A8F]/40 transition-all duration-300 group hover:-translate-y-2 flex flex-col justify-between h-full relative overflow-hidden no-underline text-inherit block cursor-pointer"
              >
                {/* Top Accent Strip on Hover */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0A4A8F] via-[#FFB703] to-[#0A4A8F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Image container */}
                  <div className="overflow-hidden rounded-2xl mb-4 aspect-[16/10] bg-slate-100 shadow-inner">
                    <img
                      src={card.src}
                      alt={card.title}
                      className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#0A4A8F] font-bold mb-1">
                    SRMU
                  </div>

                  <h3 className="font-serif text-lg text-[#0F172A] leading-snug mb-2 font-bold group-hover:text-[#0A4A8F] transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {card.text}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0A4A8F] px-2.5 py-0.5 rounded-md bg-[#0A4A8F]/8 border border-[#0A4A8F]/15">
                    {card.department}
                  </span>
                  <span className="text-xs text-[#0A4A8F] flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>Explore</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── VIEW MORE MODAL ──────────────────────────────── */}
      {isModalOpen && (
        <div
          className="view-more-overlay"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-more-title"
        >
          <div
            className="view-more-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="view-more-close"
              aria-label="Close modal"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <div className="view-more-header">
              <h3 id="view-more-title">{activeProfileData.title}</h3>
              <p>{activeProfileData.designation}</p>
            </div>

            <div className="view-more-body">
              {activeProfileData.fullContent.map((paragraph, index) =>
                typeof paragraph === "string" ? (
                  <p key={`${activeProfileData.key}-${index}`}>{paragraph}</p>
                ) : (
                  <div key={`${activeProfileData.key}-${index}`}>{paragraph}</div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;