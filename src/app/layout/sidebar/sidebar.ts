import { Component, computed, DOCUMENT, ElementRef, inject, OnInit, signal, viewChildren, ChangeDetectionStrategy } from '@angular/core';
import { scrollToSection } from '@shared/utils/scroll-to-section';
import { gsap } from 'gsap';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sidebar.scss',
})
export class Sidebar  implements OnInit {
  protected readonly visible = signal(false);
  private readonly document = inject(DOCUMENT);
  private readonly buttonRefs = viewChildren<ElementRef<HTMLButtonElement>>('linkButton');
  private readonly buttonsElements = computed(() => this.buttonRefs().map((ref) => ref.nativeElement));

  private previousBodyOverflow = ''; 

  ngOnInit() {
    gsap.set(this.buttonsElements(), { x: 32, opacity: 0 });
  }

  protected toggle(): void {
    this.visible.update((v) => !v);
    const wrapper = this.document.querySelector('#appWrapper');

    if (!(wrapper instanceof HTMLElement)) {
      return;
    }

    if (this.visible()) {
      this.lockScroll(true);
      this.animateWrapper(true);
      this.animateButtons(true);
    } else {
      this.lockScroll(false);
      this.animateWrapper(false);
      this.animateButtons(false);
    }
  }

  private lockScroll(lock: boolean): void {
    const body = this.document.body;

    if (lock) {
      this.previousBodyOverflow = body.style.overflow;
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = this.previousBodyOverflow;
    }
  }

  private animateWrapper(opening: boolean): void {
    const wrapper = this.document.querySelector('#appWrapper');

    gsap.killTweensOf(wrapper);

    if (opening) {
      gsap.to(wrapper, { right: '80%', duration: 0.5, ease: 'power2.inOut' });
    } else {
      gsap.to(wrapper, { right: '0%', duration: 0.5, ease: 'power2.inOut' });
    }
  }

  private animateButtons(opening: boolean): void {
    const buttons = this.buttonsElements();

    if (!buttons.length) {
      return;
    }

    gsap.killTweensOf(buttons);

    if (opening) {
      gsap.fromTo(
        buttons,
        { x: 32, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
          stagger: {
            each: 0.07,
            from: 'start',
          },
        },
      );
      return;
    }

    gsap.to(buttons, {
      x: 32,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      stagger: {
        each: 0.05,
        from: 'end',
      },
    });
  }

  protected scrollToSection(sectionId: string): void {
    this.toggle();
    scrollToSection(sectionId);
  }
}
