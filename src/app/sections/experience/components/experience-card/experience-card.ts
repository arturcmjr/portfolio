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

  readonly title = input<string>();
  readonly description = input<string>();
  readonly collapsed = input<boolean>(false);

  constructor() {
    effect(() => {
      const collapsed = this.collapsed();
      const card = this.card();
      if (!card) {
        return;
      }
      const expandedHeight = `${card.nativeElement.scrollHeight}px`;
      gsap.to(card.nativeElement, {
        maxHeight: collapsed ? '15px' : expandedHeight,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  }
}
