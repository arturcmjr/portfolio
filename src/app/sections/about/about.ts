import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  viewChild,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SectionHeader } from 'app/layout/section-header/section-header';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { take } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrl: './about.scss',
  imports: [SectionHeader, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About implements AfterViewInit {
  private readonly translate = inject(TranslateService);
  private readonly textContainer = viewChild<ElementRef<HTMLElement>>('textContainer');

  protected paragraphs = signal<string[]>([]);

  ngAfterViewInit(): void {
    this.translate
      .get('about.content')
      .pipe(take(1))
      .subscribe((content: string) => {
        this.paragraphs.set(content.split('\n'));
        setTimeout(() => this.initAnimation(), 0);
      });
  }

  private initAnimation(): void {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.textContainer()?.nativeElement,
        start: 'top 100%',
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
