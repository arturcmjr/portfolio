import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  viewChild,
  ElementRef,
} from '@angular/core';
import { SectionHeader } from 'app/layout/section-header/section-header';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrl: './about.scss',
  imports: [SectionHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About implements AfterViewInit {
  private readonly textContainer = viewChild<ElementRef<HTMLElement>>('textContainer');

  ngAfterViewInit(): void { // TODO: improve animation, it does not look good
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.textContainer()?.nativeElement,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });
    const paragraphs = this.textContainer()?.nativeElement.querySelectorAll('p');
    if (!paragraphs) return;
    paragraphs.forEach((p) => {
      const split = new SplitText(p, { type: 'lines' });
      timeline.fromTo(
        split.lines,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
          stagger: 0.1,
        },
      );
    });
  }
}
