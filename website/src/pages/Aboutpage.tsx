import React, { useEffect, useRef, useState } from 'react';
import {
  GraduationCap,
  Globe,
  Target,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { gsap } from 'gsap';

function Aboutpage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-hero-reveal',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'all',
        }
      );

      gsap.fromTo(
        '.about-card-reveal',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          delay: 0.2,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );

      gsap.fromTo(
        '.about-highlight-reveal',
        { scale: 0.96, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          delay: 0.35,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const missions = [
    {
      title: 'Promote Research Excellence',
      description:
        'To cultivate a strong culture of high-quality, interdisciplinary and outcome-oriented research across all disciplines of the University.',
    },
    {
      title: 'Foster Innovation and Creativity',
      description:
        'To encourage faculty, researchers and students to undertake innovative research, develop new technologies, and translate ideas into impactful solutions.',
    },
    {
      title: 'Enhance Industry–Academia Collaboration',
      description:
        'To establish and strengthen partnerships with industries, R&D organizations, government institutions and professional bodies for collaborative research and consultancy projects.',
    },
    {
      title: 'Encourage Intellectual Property and Entrepreneurship',
      description:
        'To promote patenting, copyrights, technology transfer, start-ups, incubation and commercialization of research outcomes.',
    },
    {
      title: 'Develop Research Capacity',
      description:
        'To organize research methodology workshops, faculty development programmes, seminars, training programmes and other initiatives for enhancing research competencies.',
    },
    {
      title: 'Support Young Researchers and Students',
      description:
        'To provide mentoring, resources and opportunities for students and early-career researchers to participate in research, innovation and entrepreneurial activities.',
    },
    {
      title: 'Promote High-Quality Scholarly Publications',
      description:
        'To encourage publications in reputed peer-reviewed journals, conferences, books and other recognized scholarly platforms while maintaining the highest standards of research integrity and ethics.',
    },
    {
      title: 'Create Societal Impact',
      description:
        'To encourage research and consultancy projects addressing real-world challenges and contributing to sustainable development, national priorities and community welfare.',
    },
  ];

  // Research images
  const researchImages = [
    {
      src: '/Images/5.png',
      alt: 'Research and consultancy activities',
    },
    {
      src: '/Images/6.png',
      alt: 'SRMU research facility',
    },
    {
      src: '/Images/research/8.webp',
      alt: 'Research and consultancy activities',
    },
    {
      src: '/Images/research/9.webp',
      alt: 'Research and consultancy activities',
    },
    {
      src: '/Images/research/10.webp',
      alt: 'Research and consultancy activities',
    },
    {
      src: '/Images/research/11.webp',
      alt: 'Research and consultancy activities',
    },
    {
      src: '/Images/research/12.webp',
      alt: 'Research and consultancy activities',
    },
    {
      src: '/Images/research/13.webp',
      alt: 'Research and consultancy activities',
    },
    {
      src: '/Images/research/14.webp',
      alt: 'Research and consultancy activities',
    },
    {
      src: '/Images/research/15.webp',
      alt: 'Research and consultancy activities',
    },
    {
      src: '/Images/research/16.webp',
      alt: 'Research and consultancy activities',
    },
    {
      src: '/Images/research/17.webp',
      alt: 'Research and consultancy activities',
    },
    {
      src: '/Images/research/18.webp',
      alt: 'Research and consultancy activities',
    },
    {
      src: '/Images/research/19.webp',
      alt: 'Research and consultancy activities',
    },
    {
      src: '/Images/research/20.webp',
      alt: 'Research and consultancy activities',
    },
  ];

  // Initially show 4 cards
  const [visibleCount, setVisibleCount] = useState(4);

  const handleViewMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + 4, researchImages.length)
    );
  };

  return (
    <div
      ref={pageRef}
      className="about-page home-width py-8 sm:py-14"
    >
      {/* Hero Banner */}
      <div className="about-hero mb-12 text-center max-w-3xl mx-auto">
        <div className="about-hero-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#0A4A8F]/15 shadow-sm backdrop-blur-md mb-4">
          <GraduationCap className="w-4 h-4 text-[#0A4A8F]" />

          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0C2F44]">
            Shri Ramswaroop Memorial University
          </span>
        </div>

        <h1 className="about-hero-reveal font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1F2937] tracking-tight mb-4">
          <em className="text-[#0A4A8F] not-italic font-medium">
            Research & Consultancy Cell
          </em>
        </h1>

        <p className="about-hero-reveal text-base sm:text-lg text-[#6B7280] leading-relaxed">
          Dedicated to fostering groundbreaking research, innovation, and
          scholarly excellence across engineering, technology, sciences,
          humanities, and management.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="flex flex-col gap-4 mb-12">
        {/* Vision */}
        <div className="about-card-reveal about-card blush-surface p-8 rounded-3xl bg-[#FFF8E7]/90 border border-[#FFB703]/30 shadow-md backdrop-blur-md flex flex-col justify-between hover:shadow-xl transition-all duration-300">
          <div className="w-full">
            <div className="w-12 h-12 rounded-2xl bg-[#0A4A8F] text-white flex items-center justify-center mb-6 shadow-md">
              <Globe className="w-6 h-6" />
            </div>

            <h2 className="font-serif text-2xl font-semibold text-[#1F2937] mb-4">
              Vision
            </h2>

            <p className="text-[#4B5563] text-base leading-relaxed italic">
              “To establish Shri Ramswaroop Memorial University, Barabanki as
              a centre of excellence in research, innovation and consultancy,
              fostering a vibrant research ecosystem that generates impactful
              knowledge, develops innovative solutions, strengthens
              industry–academia collaboration, and contributes meaningfully to
              sustainable societal and economic development.”
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="about-card-reveal about-card mint-surface p-8 rounded-3xl bg-[#EEF3FA]/90 border border-[#0A4A8F]/15 shadow-md backdrop-blur-md hover:shadow-xl transition-all duration-300">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFB703] text-[#0C2F44] flex items-center justify-center mb-6 shadow-md">
              <Target className="w-6 h-6" />
            </div>

            <h2 className="font-serif text-2xl font-semibold text-[#1F2937] mb-6">
              Mission
            </h2>

            <div className="space-y-2">
              {missions.map((mission, index) => (
                <div key={mission.title}>
                  <h3 className="font-serif text-lg font-medium text-[#1F2937]">
                    {index + 1}. {mission.title}
                  </h3>

                  <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed italic">
                    {mission.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="about-highlight-reveal highlights-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-[#0A4A8F]/15 shadow-lg backdrop-blur-md mb-12">
        <h3 className="font-serif text-2xl font-medium text-[#1F2937] flex items-center gap-3 mb-8">
          <Sparkles className="w-6 h-6 text-[#FFB703]" />

          <span>Research Excellence Highlights</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#0A4A8F]/08 hover:bg-[#EEF3FA]/60 transition-colors">
            <CheckCircle2 className="w-6 h-6 text-[#0A4A8F] shrink-0 mt-0.5" />

            <div>
              <strong className="block text-base font-serif text-[#1F2937] mb-1">
                Patents & Designs
              </strong>

              <span className="text-sm text-[#6B7280] leading-relaxed">
                Multiple Indian and International patents filed & published.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#0A4A8F]/08 hover:bg-[#EEF3FA]/60 transition-colors">
            <CheckCircle2 className="w-6 h-6 text-[#0A4A8F] shrink-0 mt-0.5" />

            <div>
              <strong className="block text-base font-serif text-[#1F2937] mb-1">
                Indexed Publications
              </strong>

              <span className="text-sm text-[#6B7280] leading-relaxed">
                Scopus, Web of Science, and UGC CARE recognized articles.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#0A4A8F]/08 hover:bg-[#EEF3FA]/60 transition-colors">
            <CheckCircle2 className="w-6 h-6 text-[#0A4A8F] shrink-0 mt-0.5" />

            <div>
              <strong className="block text-base font-serif text-[#1F2937] mb-1">
                Books & Monograph
              </strong>

              <span className="text-sm text-[#6B7280] leading-relaxed">
                Authored book chapters and textbooks published globally.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Research Images */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-3xl overflow-hidden">
          {researchImages
            .slice(0, visibleCount)
            .map((image, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden bg-zinc-100 shadow-md"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-contain block transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
        </div>

        {/* View More Button */}
        {visibleCount < researchImages.length && (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={handleViewMore}
              className="px-7 py-3 rounded-full bg-[#0A4A8F] text-white font-medium shadow-md hover:bg-[#0C2F44] hover:shadow-lg transition-all duration-300"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Aboutpage;

