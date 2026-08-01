'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './ScrollStory.module.css';

const chapters = [
  {
    number: '01',
    label: 'The Diamond',
    title: 'Nature\'s\nFinest Stone',
    body: 'Each diamond in our collection is hand-selected for cut, clarity, colour, and carat — the four Cs that define brilliance. Sourced ethically and certified by GIA & IGI.',
    accent: 'Ethical Sourcing · Zero Compromise',
    image: '/images/story-diamond.png',
  },
  {
    number: '02',
    label: 'The Craft',
    title: 'Microscopic\nPrecision',
    body: 'Our master karigars bring decades of generational skill to every piece. Every prong, every facet, every curve is crafted with instruments measuring to a tenth of a millimetre.',
    accent: 'Generational Artistry · Mirzapur Heritage',
    image: '/images/story-craft.png',
  },
  {
    number: '03',
    label: 'The Collection',
    title: 'Gold · Silver\n· Diamond',
    body: 'Three precious metals. Infinite possibilities. From bold men\'s rings to delicate necklaces — every piece in our collection is a statement of understated luxury.',
    accent: 'Bespoke Orders Welcome',
    image: '/images/story-showcase.png',
  },
];

export default function ScrollStory() {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const chaptersRef = useRef<(HTMLDivElement | null)[]>([]);

  // 1. Separate slideshow auto-rotation effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 7);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [activeSlide]);

  // 2. GSAP ScrollTrigger layout effect
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${chapters.length * 100}%`,
        pin: pinRef.current,
        pinSpacing: true,
        scrub: 1,
      });

      // Chapter & image animations
      const totalScroll = chapters.length * 100;
      const chapterDuration = totalScroll / chapters.length;

      chaptersRef.current.forEach((el, i) => {
        if (!el) return;
        const imgEl = imagesRef.current[i];

        const chapterStart = (i * chapterDuration) / totalScroll * 100;
        const fadeInEnd = chapterStart + 12;
        const fadeOutStart = chapterStart + chapterDuration / totalScroll * 100 - 14;
        const chapterEnd = chapterStart + chapterDuration / totalScroll * 100;

        // Text slide and fade in
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0,
            scrollTrigger: {
              trigger: containerRef.current,
              start: `${chapterStart}% top`,
              end: `${fadeInEnd}% top`,
              scrub: 1,
            },
          }
        );

        // Image full-screen wipe reveal
        if (imgEl && i > 0) {
          gsap.fromTo(imgEl,
            { clipPath: 'inset(100% 0 0 0)' },
            {
              clipPath: 'inset(0% 0 0 0)',
              scrollTrigger: {
                trigger: containerRef.current,
                start: `${chapterStart - 5}% top`,
                end: `${fadeInEnd}% top`,
                scrub: 1,
              },
            }
          );
          
          // Image contained slow scale
          const innerImg = imgEl.querySelector('img');
          if (innerImg) {
            gsap.fromTo(innerImg,
              { scale: 1.1 },
              {
                scale: 1,
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: `${chapterStart - 5}% top`,
                  end: `${fadeInEnd}% top`,
                  scrub: 1,
                },
              }
            );
          }
        }

        // Fade out text (skip last)
        if (i < chapters.length - 1) {
          gsap.to(el, {
            opacity: 0, y: -40,
            scrollTrigger: {
              trigger: containerRef.current,
              start: `${fadeOutStart}% top`,
              end: `${chapterEnd}% top`,
              scrub: 1,
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const slideImages = [
    '/images/showroom_slide_0.jpg?v=3',
    '/images/showroom_slide_1.jpg?v=3',
    '/images/showroom_slide_2.jpg?v=3',
    '/images/showroom_slide_3.jpg?v=3',
    '/images/showroom_slide_4.jpg?v=3',
    '/images/showroom_slide_5.jpg?v=3',
    '/images/showroom_slide_6.jpg?v=3',
  ];

  return (
    <section id="story" ref={containerRef} className={styles.container} aria-label="Craftsmanship story">
      <div ref={pinRef} className={styles.sticky}>
        {/* Image panels — LEFT side */}
        <div className={styles.imagePanel}>
          {chapters.map((ch, i) => (
            <div
              key={i}
              ref={(el) => { imagesRef.current[i] = el; }}
              className={styles.storyImage}
            >
              {i === 2 ? (
                // Slideshow inside Chapter 3
                <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                  {slideImages.map((src, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: activeSlide === idx ? 1 : 0,
                        transition: 'opacity 1.2s ease-in-out',
                        zIndex: activeSlide === idx ? 2 : 1,
                      }}
                    >
                      <img
                        src={src}
                        alt={`Suman Jewellers Showroom view ${idx + 1}`}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: idx === 5 ? 'left top' : 'center center',
                          filter: 'brightness(1.15) contrast(1.15)',
                          transform: idx < 4 ? 'scale(1.12)' : 'none',
                          transformOrigin: 'center',
                        }}
                        className={styles.storyImg}
                      />
                    </div>
                  ))}

                  {/* Left Arrow Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide((prev) => (prev - 1 + 7) % 7);
                    }}
                    style={{
                      position: 'absolute',
                      left: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'rgba(7, 7, 9, 0.45)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(201, 168, 76, 0.35)',
                      color: '#f0d080',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #8b6320 0%, #f0d080 50%, #8b6320 100%)';
                      e.currentTarget.style.color = '#070709';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(201, 168, 76, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(7, 7, 9, 0.45)';
                      e.currentTarget.style.color = '#f0d080';
                      e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.35)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
                    }}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>

                  {/* Right Arrow Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide((prev) => (prev + 1) % 7);
                    }}
                    style={{
                      position: 'absolute',
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'rgba(7, 7, 9, 0.45)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(201, 168, 76, 0.35)',
                      color: '#f0d080',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #8b6320 0%, #f0d080 50%, #8b6320 100%)';
                      e.currentTarget.style.color = '#070709';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(201, 168, 76, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(7, 7, 9, 0.45)';
                      e.currentTarget.style.color = '#f0d080';
                      e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.35)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
                    }}
                    aria-label="Next image"
                  >
                    ›
                  </button>

                  {/* Indicator Dots at the bottom */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 10,
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                    }}
                  >
                    {slideImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSlide(idx);
                        }}
                        style={{
                          width: activeSlide === idx ? '24px' : '8px',
                          height: '8px',
                          borderRadius: activeSlide === idx ? '4px' : '50%',
                          background: activeSlide === idx ? '#c9a84c' : 'rgba(255, 255, 255, 0.35)',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: activeSlide === idx ? '0 0 8px rgba(201, 168, 76, 0.6)' : 'none',
                        }}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <Image
                  src={ch.image}
                  alt={ch.label}
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                  className={styles.storyImg}
                />
              )}
            </div>
          ))}
        </div>

        {/* Chapter text panels — RIGHT side */}
        <div className={styles.chapters}>
          {chapters.map((ch, i) => (
            <div
              key={i}
              ref={(el) => { chaptersRef.current[i] = el; }}
              className={styles.chapter}
            >
              <div className={styles.chapterNumber}>{ch.number}</div>
              <p className={styles.chapterLabel}>{ch.label}</p>
              <h2 className={styles.chapterTitle}>
                {ch.title.split('\n').map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}
              </h2>
              <p className={styles.chapterBody}>{ch.body}</p>
              <p className={styles.chapterAccent}>— {ch.accent}</p>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className={styles.progress} aria-hidden="true">
          {chapters.map((_, i) => (
            <div key={i} className={styles.dot} />
          ))}
        </div>
      </div>
    </section>
  );
}
