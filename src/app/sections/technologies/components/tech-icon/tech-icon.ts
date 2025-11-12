import {
  Component,
  computed,
  input,
  ElementRef,
  afterNextRender,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-tech-icon',
  imports: [],
  templateUrl: './tech-icon.html',
  styleUrl: './tech-icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'glass',
  },
})
export class TechIcon {
  readonly iconName = input<string>();
  readonly iconSrc = computed(() => `icons/${this.iconName()}.svg`);

  private readonly elementRef = inject(ElementRef);

  constructor() {
    afterNextRender(() => {
      this.setupScrollAnimation();
    });
  }

  readonly tempId = 'id-' + Math.random().toString(36).substring(2, 15);

  private setupScrollAnimation(): void {
    const element = this.elementRef.nativeElement;

    ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      end: 'bottom 10%',
      onEnter: () => this.animateIn(element),
      onLeave: () => this.animateOut(element),
      onEnterBack: () => this.animateIn(element),
      onLeaveBack: () => this.animateOut(element),
      fastScrollEnd: true,
      preventOverlaps: true,
      refreshPriority: -1,
    });

    window.setTimeout(() => {
      ScrollTrigger.create({
        trigger: '#' + this.tempId,
        start: 'top top',
        end: 'bottom 50%+=100px',
        onToggle: (self) => console.log('toggled, isActive:', self.isActive),
        onUpdate: (self) => {
          console.log(
            'progress:',
            self.progress.toFixed(3),
            'direction:',
            self.direction,
            'velocity',
            self.getVelocity()
          );
        },
      });
    }, 1000);
  }

  private animateIn(element: HTMLElement): void {
    gsap.killTweensOf(element);
    gsap.set(element, { clearProps: 'all' });

    gsap.fromTo(
      element,
      {
        opacity: 0,
        scale: 0.8,
        y: 30,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        overwrite: true,
      }
    );
  }

  private animateOut(element: HTMLElement): void {
    gsap.killTweensOf(element);

    gsap.to(element, {
      opacity: 0.3,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: true,
    });
  }
}
