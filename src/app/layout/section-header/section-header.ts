import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-section-header',
  imports: [],
  templateUrl: './section-header.html',
  styleUrl: './section-header.scss',
})
export class SectionHeader implements AfterViewInit {
  private readonly titleElement = viewChild<ElementRef<HTMLElement>>('titleElement');

  readonly title = input.required<string>();

  ngAfterViewInit(): void {
    this.animateTitle();
  }

  private animateTitle(): void {
    gsap.from(this.titleElement()!.nativeElement, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: this.titleElement()!.nativeElement,
        start: 'top 90%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });
  }
}
