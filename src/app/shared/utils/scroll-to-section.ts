import { gsap } from 'gsap';

export function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);
  if (target) {
    gsap.to(window, {
      scrollTo: { y: target, offsetY: 70 },
      duration: 1,
      ease: 'power2.out',
    });
  }
}
