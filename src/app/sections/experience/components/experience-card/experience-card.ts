import { Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { CursorType } from '@shared/directives/cursor-type';
import { Tilt } from '@shared/directives/tilt';
import { gsap } from 'gsap';

@Component({
  selector: 'app-experience-card',
  imports: [Tilt, CursorType],
  templateUrl: './experience-card.html',
  styleUrl: './experience-card.scss',
})
export class ExperienceCard {
  readonly card = viewChild<ElementRef<HTMLDivElement>>('card');

  readonly title = input.required<string>();
  readonly meta = input<string>('');
  readonly description = input.required<string>();
  readonly collapsed = input<boolean>(false);

  constructor() {
    effect((onCleanup) => {
      // Re-run when translated content changes so height is recalculated.
      this.title();
      this.meta();
      this.description();

      const collapsed = this.collapsed();
      const card = this.card();
      if (!card) {
        return;
      }

      const rafId = requestAnimationFrame(() => {
        const expandedHeight = `${card.nativeElement.scrollHeight}px`;
        gsap.to(card.nativeElement, {
          maxHeight: collapsed ? '15px' : expandedHeight,
          duration: 0.5,
          ease: 'power2.out',
        });
      });

      onCleanup(() => cancelAnimationFrame(rafId));
    });
  }
}
