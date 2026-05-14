import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SplitText = ({
   text,
   className = '',
   delay = 50,
   duration = 1.25,
   ease = 'power3.out',
   splitType = 'chars',
   from = { opacity: 0, y: 40 },
   to = { opacity: 1, y: 0 },
   threshold = 0.1,
   rootMargin = '-100px',
   tag = 'p',
   textAlign = 'center',
   onLetterAnimationComplete
}) => {
   const ref = useRef(null);
   const animationCompletedRef = useRef(false);
   const [fontLoaded, setFontLoaded] = useState(false);

   useEffect(() => {
      document.fonts.ready.then(() => setFontLoaded(true));
   }, []);

   useGSAP(() => {
      if (!ref.current || !fontLoaded) return;
      if (animationCompletedRef.current) return;

      const parent = ref.current;
      const chars = parent.querySelectorAll('.split-char');

      // Calculate start position for ScrollTrigger
      const startPct = (1 - threshold) * 100;
      const start = `top ${startPct}%`;

      gsap.fromTo(
         chars,
         from,
         {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            scrollTrigger: {
               trigger: parent,
               start: start,
               once: true,
            },
            onComplete: () => {
               animationCompletedRef.current = true;
               if (onLetterAnimationComplete) onLetterAnimationComplete();
            }
         }
      );
   }, [text, fontLoaded, delay, duration, ease, from, to, threshold]);

   // Manual splitting logic to replace premium plugin
   const renderContent = () => {
      if (splitType === 'chars') {
         return text.split('').map((char, i) => (
            <span key={i} className="split-char" style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
               {char}
            </span>
         ));
      }
      // Simple fallback for words if needed, but verified requirement implies chars usually
      return text.split(' ').map((word, i) => (
         <span key={i} className="split-char" style={{ display: 'inline-block', marginRight: '0.25em' }}>
            {word}
         </span>
      ));
   };

   const Tag = tag;

   return (
      <Tag
         ref={ref}
         className={`${className} split-parent`}
         style={{ textAlign, overflow: 'hidden' }}
      >
         {renderContent()}
      </Tag>
   );
};

export default SplitText;
